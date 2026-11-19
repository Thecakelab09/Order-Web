/* =====================================================================
   TIỂU LỘC — mèo thần tài hướng dẫn khách trên website The Cake Lab
   Không dùng AI: trả lời theo kịch bản soạn sẵn + dữ liệu menu (menu-hien-tai.js).
   Cách gắn vào trang: <script src="tieu-loc.js" defer></script> (sau menu-hien-tai.js)
   ===================================================================== */
(function () {
  'use strict';

  // -------------------------------------------------------------------
  // THÔNG TIN CỬA HÀNG — điền vào đây. Mục nào để trống thì Tiểu Lộc
  // sẽ mời khách nhắn Messenger thay vì trả lời (để không nói sai).
  // -------------------------------------------------------------------
  const THONG_TIN = {
    gioMoCua: '',          // vd: '7:00 – 22:00 hằng ngày'
    giaoHang: '',          // vd: 'Shop giao nội thành Hà Nội, phí theo khoảng cách (qua Grab/Ahamove).'
    thanhToan: '',         // vd: 'Chuyển khoản hoặc tiền mặt khi nhận bánh.'
    datTruoc: '',          // vd: 'Bánh sinh nhật nên đặt trước ít nhất 1 ngày.'
  };

  const MESSENGER_URL = 'https://m.me/thecakelabvn?ref=tieuloc';
  // Các cơ sở (địa chỉ + hotline). Thêm/sửa cơ sở ở đây.
  const CUA_HANG = [
    { id: 'CS1', ten: 'CS1 — Tuệ Tĩnh', diaChi: '45 Tuệ Tĩnh, Hà Nội', hotline: '034 261 4696', tuKhoa: ['tue tinh', 'cs1'] },
    { id: 'CS2', ten: 'CS2 — Times City', diaChi: 'SH12, Park 7, Times City, Hà Nội', hotline: '087 657 5365', tuKhoa: ['times city', 'time city', 'timecity', 'park 7', 'cs2'] },
    { id: 'CS4', ten: 'CS4 — Trung Hòa', diaChi: '26 Trung Hòa, Hà Nội', hotline: '081 372 8034', tuKhoa: ['trung hoa', 'cs4'] },
  ];
  const banDo = (c) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('The Cake Lab ' + c.diaChi);
  const goi = (c) => 'tel:' + c.hotline.replace(/\D/g, '');
  const SIZE_NGUOI = { Family: [4, 6], Friends: [6, 8], Party: [8, 12] };

  // -------------------------------------------------------------------
  // Dữ liệu menu
  // -------------------------------------------------------------------
  const MENU = () => window.MENU_HIEN_TAI || [];
  const fmt = (v) => (v > 0 ? v.toLocaleString('vi-VN') + 'đ' : 'Liên hệ');
  const bo = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const giaTu = (m) => (m.sizes ? Math.min(...m.sizes.map((s) => s[1])) : m.gia);
  const laSinhNhat = (m) => m.nhom === 'BÁNH KEM SINH NHẬT';
  /** Giá hiện trên thẻ: theo size đang tư vấn (nếu có), không thì "Từ <giá thấp nhất>". */
  const giaThe = (m, size) => {
    const s = size && m.sizes && m.sizes.find((x) => x[0] === size);
    if (s) return `${size}: ${fmt(s[1])}`;
    return (m.sizes ? 'Từ ' : '') + fmt(giaTu(m));
  };
  const laBest = (m) => {
    if (m.best) return true;
    try { if (typeof isBestSeller === 'function' && typeof PRODUCTS_CACHE !== 'undefined') {
      const p = PRODUCTS_CACHE.find((x) => x.ma === m.ma); return p ? isBestSeller(p) : false;
    } } catch (e) {}
    return false;
  };

  /** Mở cửa sổ chi tiết bánh có sẵn của trang (nếu tìm thấy), không thì cuộn tới thẻ bánh. */
  function moBanh(m) {
    try {
      if (typeof PRODUCTS_CACHE !== 'undefined' && typeof openProductModal === 'function') {
        const p = PRODUCTS_CACHE.find((x) => x.ma === m.ma) ||
          PRODUCTS_CACHE.find((x) => bo(x.ten).startsWith(bo(m.ten)));
        if (p) { openProductModal(p); theoDoi('xem_banh', m.ten); return; }
      }
    } catch (e) {}
    const card = document.querySelector(`.product-card[data-product-id="${m.ma}"]`);
    if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); card.click(); }
  }
  function chuyenTab(tab) {
    const btn = document.querySelector(`.tab[data-tab="${tab}"]`);
    if (btn) { btn.click(); btn.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
  function theoDoi(hanhDong, chiTiet) {
    try { if (typeof fbq === 'function') fbq('trackCustom', 'TieuLoc', { action: hanhDong, detail: chiTiet || '' }); } catch (e) {}
  }

  // -------------------------------------------------------------------
  // Giao diện
  // -------------------------------------------------------------------
  const CAT_SVG = `<svg class="tl-cat" viewBox="0 0 120 132" aria-label="Tiểu Lộc"> <defs> <clipPath id="tlHeadClip"><ellipse cx="58" cy="50" rx="38" ry="31" /></clipPath> <clipPath id="tlBodyClip"><path d="M26 116 C22 90 30 68 58 66 C86 68 96 90 92 116 Z" /></clipPath> <linearGradient id="tlFur" x1="0" y1="0" x2="0" y2="1"> <stop offset="0" stop-color="#ffffff" /><stop offset="1" stop-color="#ece7df" /> </linearGradient> </defs> <g class="tl-dots" fill="#e0464f"> <circle cx="24" cy="10" r="3" /><circle cx="15" cy="6" r="3.5" /><circle cx="5" cy="2" r="4" /> </g> <rect x="10" y="114" width="100" height="15" rx="4" fill="#b81f2f" /> <rect x="14" y="111" width="92" height="10" rx="3" fill="#e0353f" /> <path d="M20 113 H100" stroke="#ff7a7f" stroke-width="1.5" stroke-linecap="round" opacity=".7" /> <path d="M88 110 q16 -2 14 -18" stroke="#f0a040" stroke-width="7" fill="none" stroke-linecap="round" /> <path d="M26 116 C22 90 30 68 58 66 C86 68 96 90 92 116 Z" fill="url(#tlFur)" stroke="#e2dbd0" stroke-width="1.2" /> <g clip-path="url(#tlBodyClip)"> <ellipse cx="24" cy="100" rx="8" ry="10" fill="#2f2b2b" /> <ellipse cx="94" cy="92" rx="7" ry="9" fill="#f0a040" /> </g> <g fill="#fff" stroke="#e2dbd0" stroke-width="1.2"> <ellipse cx="40" cy="114" rx="10" ry="5.5" /><ellipse cx="76" cy="114" rx="10" ry="5.5" /> </g> <g stroke="#a99d92" stroke-width="1.2" stroke-linecap="round"> <path d="M37 111 v3" /><path d="M41 111 v3" /><path d="M73 111 v3" /><path d="M77 111 v3" /> </g> <g class="tl-paw"> <path d="M84 92 C92 76 98 56 99 40 L114 40 C115 58 107 80 98 96 Z" fill="url(#tlFur)" stroke="#e2dbd0" stroke-width="1.2" /> <circle cx="107" cy="33" r="10" fill="#fff" stroke="#e2dbd0" stroke-width="1.2" /> <ellipse cx="107" cy="36" rx="3.4" ry="2.8" fill="#f6b1bd" /> <g fill="#f6b1bd"><circle cx="102.5" cy="29.5" r="1.5" /><circle cx="107" cy="28" r="1.5" /><circle cx="111.5" cy="29.5" r="1.5" /></g> </g> <path d="M24 40 L28 9 L52 26 Z" fill="#2f2b2b" /> <path d="M30 34 L32 17 L45 27 Z" fill="#5a4f4f" /> <path d="M64 26 L88 9 L92 40 Z" fill="#f0a040" /> <path d="M71 27 L85 17 L87 34 Z" fill="#f6b1bd" /> <ellipse cx="58" cy="50" rx="38" ry="31" fill="url(#tlFur)" stroke="#e2dbd0" stroke-width="1.2" /> <g clip-path="url(#tlHeadClip)"> <circle cx="84" cy="24" r="15" fill="#f0a040" /> <circle cx="30" cy="25" r="10" fill="#2f2b2b" /> </g> <path d="M27 77 Q58 92 89 77 L89 85 Q58 100 27 85 Z" fill="#d7263d" /> <path d="M30 80 Q58 93 86 80" stroke="#ff6b74" stroke-width="1.2" fill="none" opacity=".7" /> <g> <circle cx="58" cy="95" r="6.5" fill="#f2c14e" stroke="#c9962a" stroke-width="1.2" /> <path d="M52 94 H64" stroke="#c9962a" stroke-width="1.1" /> <circle cx="58" cy="97.5" r="1.4" fill="#5a3d10" /> <path d="M58 98.5 V101" stroke="#5a3d10" stroke-width="1.2" stroke-linecap="round" /> <circle cx="55.5" cy="92.5" r="1.6" fill="#fff6d8" /> </g> <ellipse cx="38" cy="98" rx="9" ry="7.5" fill="#fff" stroke="#e2dbd0" stroke-width="1.2" /> <g stroke="#a99d92" stroke-width="1.2" stroke-linecap="round"><path d="M35 92 v3" /><path d="M39 91.5 v3" /></g> <path d="M55 60 H61 L58 63.5 Z" fill="#f08aa0" stroke-linejoin="round" /> <g stroke="#4a4040" stroke-width="1.4" stroke-linecap="round"> <path d="M27 60 L15 57" /><path d="M27 64 L14 65" /> <path d="M89 60 L98 58" /><path d="M89 64 L98 65" /> </g> <g class="face" transform="translate(-2 -38)" stroke-linecap="round" stroke-linejoin="round"> <ellipse class="cheek" cx="32" cy="104" rx="7" ry="4" fill="#ff8fb1" opacity=".55" /> <ellipse class="cheek" cx="88" cy="104" rx="7" ry="4" fill="#ff8fb1" opacity=".55" /> <g data-part="extra" data-v="blush" fill="#ff6f9c" opacity=".6"> <line x1="27" y1="102" x2="30" y2="106" stroke="#ff6f9c" stroke-width="1.5" /> <line x1="32" y1="102" x2="35" y2="106" stroke="#ff6f9c" stroke-width="1.5" /> <line x1="85" y1="102" x2="88" y2="106" stroke="#ff6f9c" stroke-width="1.5" /> <line x1="90" y1="102" x2="93" y2="106" stroke="#ff6f9c" stroke-width="1.5" /> </g> <g data-part="eyes" data-v="normal"> <g class="tl-look"> <ellipse class="blinker" cx="44" cy="92" rx="6" ry="7.5" fill="#3a2220" /> <ellipse class="blinker" cx="76" cy="92" rx="6" ry="7.5" fill="#3a2220" /> <circle cx="46" cy="89" r="2" fill="#fff" /> <circle cx="78" cy="89" r="2" fill="#fff" /> </g> </g> <g data-part="eyes" data-v="happy" stroke="#3a2220" stroke-width="3.2" fill="none"> <path d="M38 94 Q44 85 50 94" /><path d="M70 94 Q76 85 82 94" /> </g> <g data-part="eyes" data-v="laugh" stroke="#3a2220" stroke-width="3.2" fill="none"> <path d="M39 87 L49 92 L39 97" /><path d="M81 87 L71 92 L81 97" /> </g> <g data-part="eyes" data-v="closed" stroke="#3a2220" stroke-width="3" fill="none"> <path d="M38 92 Q44 97 50 92" /><path d="M70 92 Q76 97 82 92" /> </g> <g data-part="eyes" data-v="wink"> <ellipse class="blinker" cx="44" cy="92" rx="6" ry="7.5" fill="#3a2220" /> <circle cx="46" cy="89" r="2" fill="#fff" /> <path d="M70 93 Q76 86 82 93" stroke="#3a2220" stroke-width="3.2" fill="none" /> </g> <g data-part="eyes" data-v="wide"> <circle cx="44" cy="91" r="8.5" fill="#fff" stroke="#3a2220" stroke-width="2" /> <circle cx="76" cy="91" r="8.5" fill="#fff" stroke="#3a2220" stroke-width="2" /> <circle cx="44" cy="91" r="3.6" fill="#3a2220" /><circle cx="76" cy="91" r="3.6" fill="#3a2220" /> </g> <g data-part="eyes" data-v="heart" fill="#e23a5a"> <path class="heart-eye" d="M44 99 L37 91 A4 4 0 0 1 44 86 A4 4 0 0 1 51 91 Z" /> <path class="heart-eye" d="M76 99 L69 91 A4 4 0 0 1 76 86 A4 4 0 0 1 83 91 Z" /> </g> <g data-part="eyes" data-v="star" fill="#ffc83d" stroke="#e8a317" stroke-width="1"> <path class="star-eye" d="M44 83 L46.4 89 L52.5 89.4 L47.8 93.3 L49.3 99.2 L44 95.8 L38.7 99.2 L40.2 93.3 L35.5 89.4 L41.6 89 Z" /> <path class="star-eye" d="M76 83 L78.4 89 L84.5 89.4 L79.8 93.3 L81.3 99.2 L76 95.8 L70.7 99.2 L72.2 93.3 L67.5 89.4 L73.6 89 Z" /> </g> <g data-part="eyes" data-v="sad"> <ellipse class="blinker" cx="44" cy="94" rx="5.5" ry="6.5" fill="#3a2220" /> <ellipse class="blinker" cx="76" cy="94" rx="5.5" ry="6.5" fill="#3a2220" /> <circle cx="45.5" cy="92" r="1.8" fill="#fff" /><circle cx="77.5" cy="92" r="1.8" fill="#fff" /> </g> <g data-part="eyes" data-v="cool"> <path d="M33 86 H55 Q55 99 45 99 Q35 99 33 86 Z" fill="#2b1b1a" /> <path d="M65 86 H87 Q87 99 77 99 Q67 99 65 86 Z" fill="#2b1b1a" /> <path d="M55 88 H65" stroke="#2b1b1a" stroke-width="2.5" /> <path d="M38 89 L42 89" stroke="#fff" stroke-width="2" opacity=".7" /> <path d="M70 89 L74 89" stroke="#fff" stroke-width="2" opacity=".7" /> </g> <g data-part="brows" data-v="sad" stroke="#3a2220" stroke-width="2.6" fill="none"> <path d="M37 83 L50 79" /><path d="M83 83 L70 79" /> </g> <g data-part="brows" data-v="angry" stroke="#3a2220" stroke-width="2.8" fill="none"> <path d="M37 79 L50 85" /><path d="M83 79 L70 85" /> </g> <g data-part="brows" data-v="confused" stroke="#3a2220" stroke-width="2.6" fill="none"> <path d="M38 81 Q44 77 50 81" /><path d="M70 84 L83 83" /> </g> <g data-part="brows" data-v="up" stroke="#3a2220" stroke-width="2.4" fill="none"> <path d="M38 79 Q44 75 50 79" /><path d="M70 79 Q76 75 82 79" /> </g> <path data-part="mouth" data-v="smile" d="M53 104 Q60 112 67 104" stroke="#3a2220" stroke-width="3" fill="none" /> <g data-part="mouth" data-v="grin"> <path d="M50 103 Q60 118 70 103 Z" fill="#3a2220" stroke="#3a2220" stroke-width="2" /> <path d="M55 110 Q60 115 65 110 Q60 107 55 110 Z" fill="#ff7a93" /> </g> <ellipse data-part="mouth" data-v="o" cx="60" cy="107" rx="4" ry="5" fill="#3a2220" /> <ellipse data-part="mouth" data-v="small-o" cx="60" cy="107" rx="2.6" ry="2.6" fill="#3a2220" /> <path data-part="mouth" data-v="frown" d="M53 110 Q60 102 67 110" stroke="#3a2220" stroke-width="3" fill="none" /> <path data-part="mouth" data-v="wavy" d="M51 107 q3 -4 6 0 t6 0 t6 0" stroke="#3a2220" stroke-width="2.6" fill="none" /> <path data-part="mouth" data-v="cat" d="M53 104 q3.5 5 7 0 q3.5 5 7 0" stroke="#3a2220" stroke-width="2.6" fill="none" /> <path data-part="mouth" data-v="flat" d="M55 106 H65" stroke="#3a2220" stroke-width="3" fill="none" /> <path data-part="mouth" data-v="smirk" d="M53 106 Q61 110 68 102" stroke="#3a2220" stroke-width="3" fill="none" /> <ellipse data-part="mouth" data-v="talk" class="talk" cx="60" cy="107" rx="6" ry="5" fill="#3a2220" /> <path data-part="extra" data-v="tear" class="tear" d="M83 98 Q80 104 83 106 Q86 104 83 98 Z" fill="#7ec8e3" /> <path data-part="extra" data-v="sweat" d="M98 74 Q93 82 98 85 Q103 82 98 74 Z" fill="#a8dcf0" stroke="#7ec8e3" stroke-width="1" /> <g data-part="extra" data-v="anger" stroke="#e23a5a" stroke-width="2.6" fill="none"> <path d="M92 44 q4 3 0 6" /><path d="M100 44 q-4 3 0 6" /><path d="M92 54 q4 -3 8 0" /> </g> <g data-part="extra" data-v="sparkle" fill="#ffd166"> <path class="sparkle" d="M14 40 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" /> <path class="sparkle" d="M106 30 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" /> </g> </g> </svg>`;

  const css = `
  #tl-root { --tl-red:#d7263d; --tl-red2:#b81f2f; --tl-ink:#241b12; --tl-muted:#7f6f5f; --tl-line:rgba(36,27,18,.14);
    position:fixed; right:16px; bottom:12px; z-index:90; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color:var(--tl-ink); }
  #tl-root * { box-sizing:border-box; }
  #tl-stage { position:relative; width:96px; height:106px; margin-left:auto; cursor:pointer; transform-origin:50% 100%; }
  #tl-stage .tl-cat { width:100%; height:100%; overflow:visible; filter:drop-shadow(0 6px 10px rgba(80,30,30,.28)); animation:tl-bob 3s ease-in-out infinite; }
  @keyframes tl-bob { 0%,100%{translate:0 0} 50%{translate:0 -5px} }
  #tl-stage:hover .tl-cat { animation:tl-bob 3s ease-in-out infinite, tl-wig .5s ease-in-out; }
  @keyframes tl-wig { 0%,100%{rotate:0deg} 25%{rotate:-6deg} 75%{rotate:6deg} }
  #tl-stage.tl-hop { animation:tl-hop .55s ease-out; }
  @keyframes tl-hop { 0%{translate:0 0} 40%{translate:0 -16px} 100%{translate:0 0} }
  .tl-paw { transform-box:view-box; transform-origin:92px 92px; animation:tl-beckon 1.8s ease-in-out infinite; }
  @keyframes tl-beckon { 0%,100%{rotate:0deg} 50%{rotate:-16deg} }
  #tl-root[data-emote="excited"] .tl-paw, #tl-root[data-emote="happy"] .tl-paw { animation-duration:.6s; }
  #tl-root[data-emote="thinking"] .tl-paw { animation-play-state:paused; }
  .tl-dots { display:none; }
  .blinker { transform-box:fill-box; transform-origin:center; animation:tl-blink 4.5s infinite; }
  @keyframes tl-blink { 0%,94%,100%{transform:scaleY(1)} 97%{transform:scaleY(.1)} }
  .tl-talk { transform-box:fill-box; transform-origin:center; animation:tl-talk .22s infinite alternate; }
  @keyframes tl-talk { from{transform:scaleY(.35)} to{transform:scaleY(1)} }
  .heart-eye { transform-box:fill-box; transform-origin:center; animation:tl-pulse .8s ease-in-out infinite; }
  @keyframes tl-pulse { 0%,100%{scale:1} 50%{scale:1.08} }
  .star-eye { transform-box:fill-box; transform-origin:center; animation:tl-spin 2.5s linear infinite; }
  @keyframes tl-spin { to{rotate:360deg} }
  .sparkle { transform-box:fill-box; transform-origin:center; animation:tl-tw 1s ease-in-out infinite; }
  @keyframes tl-tw { 0%,100%{scale:.5;opacity:.4} 50%{scale:1.1;opacity:1} }

  #tl-hint { position:absolute; right:92px; bottom:70px; width:max-content; max-width:230px; background:#fff; border:1px solid var(--tl-line);
    border-radius:16px 16px 4px 16px; padding:10px 28px 10px 13px; font-size:14px; line-height:1.4; box-shadow:0 10px 28px rgba(36,27,18,.18);
    opacity:0; transform:translateY(8px); transition:.25s; pointer-events:none; }
  #tl-hint.tl-show { opacity:1; transform:none; pointer-events:auto; cursor:pointer; }
  #tl-hint .tl-x { position:absolute; top:4px; right:6px; border:0; background:none; color:var(--tl-muted); font-size:16px; cursor:pointer; padding:2px 4px; }

  #tl-panel { position:absolute; right:0; bottom:112px; width:360px; max-width:calc(100vw - 24px); height:min(560px, calc(100vh - 150px));
    display:flex; flex-direction:column; background:#fffdf9; border:1px solid var(--tl-line); border-radius:20px; overflow:hidden;
    box-shadow:0 18px 50px rgba(36,27,18,.25); transform-origin:90% 100%; transform:scale(.85) translateY(16px); opacity:0;
    pointer-events:none; transition:transform .22s cubic-bezier(.3,1.4,.5,1), opacity .18s; }
  #tl-root.tl-open #tl-panel { transform:none; opacity:1; pointer-events:auto; }
  .tl-head { display:flex; align-items:center; gap:10px; padding:12px 12px 12px 14px; background:linear-gradient(135deg,#d7263d,#b81f2f); color:#fff; }
  .tl-head .tl-av { width:34px; height:34px; border-radius:50%; background:#fff3e2; display:grid; place-items:center; overflow:hidden; flex:none; }
  .tl-head .tl-av svg { width:40px; height:44px; margin-top:6px; }
  .tl-head b { display:block; font-size:15px; } .tl-head small { opacity:.85; font-size:12px; }
  .tl-head .tl-hbtn { margin-left:auto; display:flex; gap:2px; }
  .tl-head button { border:0; background:rgba(255,255,255,.14); color:#fff; width:30px; height:30px; border-radius:9px; cursor:pointer; font-size:16px; display:grid; place-items:center; }
  .tl-head button:hover { background:rgba(255,255,255,.28); }
  #tl-log { flex:1; overflow-y:auto; padding:14px 12px 6px; display:flex; flex-direction:column; gap:9px; scroll-behavior:smooth; }
  #tl-log > * { flex-shrink:0; }
  .tl-msg { max-width:88%; padding:9px 12px; border-radius:16px; font-size:14px; line-height:1.45; white-space:pre-line; word-wrap:break-word; }
  .tl-bot { align-self:flex-start; background:#fff; border:1px solid var(--tl-line); border-bottom-left-radius:5px; }
  .tl-me { align-self:flex-end; background:#032c7d; color:#fff; border-bottom-right-radius:5px; }
  .tl-msg b { font-weight:700; }
  .tl-cards { align-self:stretch; display:flex; gap:8px; overflow-x:auto; padding:2px 2px 6px; scroll-snap-type:x mandatory; }
  .tl-card { flex:none; width:128px; background:#fff; border:1px solid var(--tl-line); border-radius:14px; overflow:hidden; cursor:pointer; scroll-snap-align:start;
    text-align:left; padding:0; font:inherit; color:inherit; transition:transform .15s, box-shadow .15s; }
  .tl-card:hover { transform:translateY(-2px); box-shadow:0 8px 18px rgba(36,27,18,.14); }
  .tl-card img { width:100%; aspect-ratio:1; object-fit:cover; display:block; background:#f6efe6; }
  .tl-card div { padding:7px 8px 9px; font-size:12.5px; line-height:1.3; }
  .tl-card strong { display:block; font-size:12.5px; margin-bottom:3px; }
  .tl-card span { color:var(--tl-red); font-weight:700; }
  .tl-store { align-self:stretch; background:#fff; border:1px solid var(--tl-line); border-radius:14px; padding:10px 12px; font-size:13.5px; line-height:1.5; }
  .tl-store strong { display:block; margin-bottom:2px; }
  .tl-store-act { display:flex; gap:6px; margin-top:7px; }
  .tl-store-act a { flex:1; text-align:center; text-decoration:none; border:1px solid rgba(215,38,61,.35); color:var(--tl-red2); border-radius:999px; padding:6px 8px; font-weight:600; font-size:12.5px; }
  .tl-store-act a:hover { background:#fff0f0; }
  .tl-chips { display:flex; flex-wrap:wrap; gap:6px; padding:4px 12px 10px; }
  .tl-chip { border:1px solid rgba(215,38,61,.35); background:#fff; color:var(--tl-red2); border-radius:999px; padding:7px 12px; font-size:13px; font-weight:600;
    cursor:pointer; font-family:inherit; transition:background .15s; }
  .tl-chip:hover { background:#fff0f0; }
  .tl-chip.tl-main { background:var(--tl-red); color:#fff; border-color:var(--tl-red); }
  .tl-chip.tl-main:hover { background:var(--tl-red2); }
  .tl-form { display:flex; gap:8px; padding:10px; border-top:1px solid var(--tl-line); background:#fff; }
  .tl-form input { flex:1; border:1px solid var(--tl-line); border-radius:999px; padding:10px 14px; font:inherit; font-size:14px; outline:none; min-width:0; }
  .tl-form input:focus { border-color:var(--tl-red); }
  .tl-form button { border:0; background:var(--tl-red); color:#fff; border-radius:999px; padding:0 16px; font-weight:700; cursor:pointer; font-family:inherit; }
  .tl-typing { align-self:flex-start; display:flex; gap:4px; padding:12px 14px; background:#fff; border:1px solid var(--tl-line); border-radius:16px; border-bottom-left-radius:5px; }
  .tl-typing i { width:7px; height:7px; border-radius:50%; background:#c9b9a8; animation:tl-dot 1s infinite; }
  .tl-typing i:nth-child(2){animation-delay:.15s} .tl-typing i:nth-child(3){animation-delay:.3s}
  @keyframes tl-dot { 0%,100%{opacity:.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-3px)} }
  @media (max-width:600px) {
    #tl-root { right:8px; bottom:8px; }
    #tl-stage { width:74px; height:82px; }
    #tl-hint { right:72px; bottom:52px; max-width:200px; font-size:13px; }
    #tl-panel { position:fixed; left:8px; right:8px; bottom:94px; width:auto; max-width:none; height:min(540px, calc(100vh - 110px)); }
  }
  @media (prefers-reduced-motion:reduce) { #tl-root *, #tl-stage { animation:none !important; transition:none !important; } }
  `;

  const root = document.createElement('div');
  root.id = 'tl-root';
  root.innerHTML = `
    <style>${css}</style>
    <div id="tl-panel" role="dialog" aria-label="Tiểu Lộc — hướng dẫn viên The Cake Lab">
      <div class="tl-head">
        <div class="tl-av">${CAT_SVG}</div>
        <div><b>Tiểu Lộc</b><small>Hướng dẫn viên The Cake Lab</small></div>
        <div class="tl-hbtn">
          <button type="button" id="tl-reset" title="Bắt đầu lại">↺</button>
          <button type="button" id="tl-close" title="Thu nhỏ">✕</button>
        </div>
      </div>
      <div id="tl-log" aria-live="polite"></div>
      <div class="tl-chips" id="tl-chips"></div>
      <form class="tl-form" id="tl-form" autocomplete="off">
        <input id="tl-input" type="text" placeholder="Hỏi Tiểu Lộc, vd: bánh cho 8 người…" maxlength="200" />
        <button type="submit">Gửi</button>
      </form>
    </div>
    <div id="tl-hint"><button type="button" class="tl-x" aria-label="Đóng">×</button><span></span></div>
    <div id="tl-stage" title="Hỏi Tiểu Lộc" role="button" tabindex="0" aria-label="Mở trò chuyện với Tiểu Lộc">${CAT_SVG}</div>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const log = $('#tl-log'), chips = $('#tl-chips'), input = $('#tl-input'), stage = $('#tl-stage'), hint = $('#tl-hint');

  // -------------------------------------------------------------------
  // Biểu cảm (dùng chung bộ nét mặt với bản trên máy tính)
  // -------------------------------------------------------------------
  const EMOTES = {
    neutral: { eyes: 'normal', mouth: 'cat' },
    happy: { eyes: 'happy', mouth: 'grin', extra: ['blush'] },
    excited: { eyes: 'star', mouth: 'grin', extra: ['sparkle'] },
    love: { eyes: 'heart', mouth: 'cat', extra: ['blush'] },
    wink: { eyes: 'wink', mouth: 'smirk' },
    surprised: { eyes: 'wide', mouth: 'o', brows: 'up' },
    confused: { eyes: 'normal', mouth: 'wavy', brows: 'confused' },
    thinking: { eyes: 'normal', mouth: 'flat', brows: 'up', look: [3, -3] },
    proud: { eyes: 'cool', mouth: 'smirk', extra: ['sparkle'] },
    shy: { eyes: 'happy', mouth: 'wavy', extra: ['blush', 'sweat'] },
    sad: { eyes: 'sad', mouth: 'frown', brows: 'sad', extra: ['tear'] },
  };
  let emote = 'neutral', talking = false, revertT = null;
  function ve() {
    const e = EMOTES[emote] || EMOTES.neutral;
    const want = { eyes: e.eyes, mouth: talking ? 'talk' : e.mouth, brows: e.brows || 'none', extra: e.extra || [] };
    root.querySelectorAll('[data-part]').forEach((el) => {
      const v = want[el.dataset.part];
      el.style.display = (Array.isArray(v) ? v.includes(el.dataset.v) : v === el.dataset.v) ? '' : 'none';
      if (el.dataset.v === 'talk') el.classList.add('tl-talk');
    });
    const [x, y] = e.look || [0, 0];
    root.querySelectorAll('.tl-look').forEach((l) => (l.style.transform = `translate(${x}px,${y}px)`));
    root.querySelectorAll('.cheek').forEach((c) => (c.style.opacity = e.extra && e.extra.includes('blush') ? 1 : 0.55));
  }
  function camXuc(ten, giu = 4000) {
    emote = EMOTES[ten] ? ten : 'neutral';
    root.dataset.emote = emote;
    ve();
    if (ten === 'happy' || ten === 'excited' || ten === 'love') { stage.classList.remove('tl-hop'); void stage.offsetWidth; stage.classList.add('tl-hop'); }
    clearTimeout(revertT);
    if (giu) revertT = setTimeout(() => camXuc('neutral', 0), giu);
  }
  ve();

  // -------------------------------------------------------------------
  // Hiển thị tin nhắn
  // -------------------------------------------------------------------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const dam = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  const cuon = () => (log.scrollTop = log.scrollHeight);
  let hangDoi = Promise.resolve();
  /** Tin của khách cũng xếp hàng, để luôn hiện đúng thứ tự với lời của Tiểu Lộc. */
  function tinKhach(text) {
    hangDoi = hangDoi.then(() => {
      const d = document.createElement('div'); d.className = 'tl-msg tl-me'; d.textContent = text; log.appendChild(d); cuon();
    });
  }
  /** Tiểu Lộc trả lời: hiện "đang gõ" một chút cho tự nhiên, rồi hiện chữ + thẻ bánh + nút gợi ý. */
  function tra(text, { cards = [], options = null, mood = 'happy', size = null, stores = [] } = {}) {
    hangDoi = hangDoi.then(() => new Promise((done) => {
      const typing = document.createElement('div');
      typing.className = 'tl-typing'; typing.innerHTML = '<i></i><i></i><i></i>';
      log.appendChild(typing); cuon(); camXuc('thinking', 0);
      setTimeout(() => {
        typing.remove();
        const d = document.createElement('div'); d.className = 'tl-msg tl-bot'; d.innerHTML = dam(text); log.appendChild(d);
        if (cards.length) {
          const row = document.createElement('div'); row.className = 'tl-cards';
          cards.slice(0, 20).forEach((m) => {
            const b = document.createElement('button'); b.type = 'button'; b.className = 'tl-card';
            b.innerHTML = `<img src="${esc(m.img || '')}" alt="${esc(m.ten)}" loading="lazy"><div><strong>${esc(m.ten)}</strong><span>${giaThe(m, size)}</span></div>`;
            b.addEventListener('click', () => { moBanh(m); camXuc('love'); });
            b.querySelector('img').addEventListener('load', cuon, { once: true });
            row.appendChild(b);
          });
          log.appendChild(row);
        }
        stores.forEach((c) => {
          const box = document.createElement('div'); box.className = 'tl-store';
          box.innerHTML = `<strong>🏪 ${esc(c.ten)}</strong><div>📍 ${esc(c.diaChi)}</div><div>📞 ${esc(c.hotline)}</div>
            <div class="tl-store-act"><a href="${banDo(c)}" target="_blank" rel="noopener">📍 Chỉ đường</a><a href="${goi(c)}">📞 Gọi ngay</a></div>`;
          box.querySelectorAll('a').forEach((a, i) => a.addEventListener('click', () => theoDoi(i ? 'goi_dien' : 'chi_duong', c.id)));
          log.appendChild(box);
        });
        cuon(); camXuc(mood);
        if (options) datNut(options);
        done();
      }, Math.min(1100, 350 + text.length * 6));
    }));
  }
  function datNut(list) {
    chips.innerHTML = '';
    list.forEach(([nhan, viec, chinh]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tl-chip' + (chinh ? ' tl-main' : ''); b.textContent = nhan;
      b.addEventListener('click', () => { tinKhach(nhan.replace(/^\S+\s/, (x) => (/\p{Extended_Pictographic}/u.test(x) ? '' : x))); viec(); });
      chips.appendChild(b);
    });
  }

  // -------------------------------------------------------------------
  // Kịch bản trả lời
  // -------------------------------------------------------------------
  const NUT_CHINH = () => [
    ['🎂 Gợi ý bánh sinh nhật', hoiSoNguoi, true],
    ['⭐ Bánh bán chạy', bestSeller],
    ['✨ Bánh mới', banhMoi],
    ['📝 Cách đặt bánh', cachDat],
    ['🏪 Cửa hàng', () => cuaHang()],
    ['💬 Gặp nhân viên', gapNhanVien],
  ];
  const NUT_SAU = () => [['🏠 Menu chính', menuChinh], ['💬 Gặp nhân viên', gapNhanVien]];

  function chao() {
    tra('Dạ em chào anh/chị ạ! Em là **Tiểu Lộc** — mèo thần tài của The Cake Lab 🐱\nEm có thể giúp anh/chị chọn bánh, xem giá, hoặc hướng dẫn cách đặt bánh. Anh/chị cần em giúp gì ạ?',
      { options: NUT_CHINH(), mood: 'happy' });
  }
  function menuChinh() { tra('Dạ anh/chị muốn xem gì tiếp ạ?', { options: NUT_CHINH(), mood: 'happy' }); }

  function hoiSoNguoi() {
    tra('Dạ bánh sinh nhật nhà em có 3 size ạ:\n• **Family** — khoảng 4–6 người\n• **Friends** — khoảng 6–8 người\n• **Party** — khoảng 8–12 người\nBuổi tiệc của anh/chị có khoảng bao nhiêu người ạ?', {
      mood: 'excited',
      options: [['👨‍👩‍👧 Dưới 6 người', () => goiYSize('Family')], ['🎉 6–8 người', () => goiYSize('Friends')],
        ['🥳 8–12 người', () => goiYSize('Party')], ['🎊 Trên 12 người', tiecLon], ['🏠 Menu chính', menuChinh]],
    });
  }
  function goiYSize(size, soNguoi) {
    const bs = MENU().filter(laSinhNhat);
    const gia = bs.map((m) => (m.sizes.find((s) => s[0] === size) || [])[1]).filter(Boolean);
    const [a, b] = SIZE_NGUOI[size];
    const top = bs.filter(laBest).concat(bs.filter((m) => m.moi && !laBest(m))).concat(bs.filter((m) => !laBest(m) && !m.moi));
    tra(`${soNguoi ? `Dạ ${soNguoi} người thì` : 'Dạ vậy'} anh/chị chọn **size ${size}** (khoảng ${a}–${b} người) là vừa đẹp ạ 🎂\nSize này giá từ **${fmt(Math.min(...gia))}** đến **${fmt(Math.max(...gia))}**. Đây là các vị bánh sinh nhật, anh/chị bấm vào bánh để xem chi tiết và đặt nhé:`,
      { cards: top, size, mood: 'excited', options: [['📝 Cách đặt bánh', cachDat], ['🔁 Chọn size khác', hoiSoNguoi], ...NUT_SAU()] });
  }
  function tiecLon() {
    tra('Dạ tiệc đông vậy vui quá ạ 🥳 Size lớn nhất là **Party** (8–12 người). Anh/chị có thể đặt 2 bánh, hoặc nhắn shop để được tư vấn bánh thiết kế riêng cho tiệc lớn ạ.',
      { mood: 'surprised', options: [['🥳 Xem bánh size Party', () => goiYSize('Party')], ['💬 Nhắn shop tư vấn', gapNhanVien, true], ['🏠 Menu chính', menuChinh]] });
  }
  function bestSeller() {
    const ds = MENU().filter(laBest);
    if (!ds.length) return tra('Dạ hiện em chưa có danh sách bánh bán chạy, anh/chị xem menu trên trang giúp em nhé ạ.', { options: NUT_SAU(), mood: 'shy' });
    tra(`Dạ đây là **${ds.length} bánh bán chạy nhất** nhà em ạ ⭐ Anh/chị bấm vào bánh để xem chi tiết nhé:`, { cards: ds, mood: 'proud', options: [['✨ Bánh mới', banhMoi], ...NUT_SAU()] });
  }
  function banhMoi() {
    const ds = MENU().filter((m) => m.moi);
    if (!ds.length) return tra('Dạ hiện chưa có bánh mới ạ, anh/chị xem thử bánh bán chạy nhé!', { options: [['⭐ Bánh bán chạy', bestSeller], ...NUT_SAU()] });
    tra(`Dạ nhà em vừa ra **${ds.length} bánh mới** nè anh/chị ơi ✨`, { cards: ds, mood: 'excited', options: [['⭐ Bánh bán chạy', bestSeller], ...NUT_SAU()] });
  }
  function nhomBanh(nhom, loi) {
    const ds = MENU().filter((m) => m.nhom === nhom);
    tra(loi + ` (${ds.length} loại)`, { cards: ds, mood: 'happy', options: NUT_SAU() });
  }
  function cachDat() {
    tra('Dạ đặt bánh rất đơn giản ạ:\n**1.** Chọn tab **“Bánh có sẵn tại cửa hàng”** (mua lấy ngay) hoặc **“Order bánh đặt trước”**.\n**2.** Bấm vào bánh anh/chị thích, chọn size.\n**3.** Bấm **“Nhắn tin đặt bánh này qua Messenger”** — nội dung tin nhắn đã được chép sẵn, anh/chị chỉ cần **dán và gửi** là xong ạ! 📋\nNhân viên sẽ trả lời và xác nhận đơn cho anh/chị.',
      { mood: 'proud', options: [['🏪 Bánh có sẵn tại cửa hàng', () => { chuyenTab('pickup'); coSan(); }], ['📅 Đặt bánh trước', () => { chuyenTab('order'); datTruoc(); }], ...NUT_SAU()] });
  }
  function coSan() {
    tra('Dạ em đã chuyển sang tab **Bánh có sẵn tại cửa hàng** rồi ạ. Ở đây anh/chị chọn cơ sở gần mình để xem bánh đang có, rồi ghé lấy hoặc nhắn shop giữ bánh nhé!',
      { mood: 'happy', options: [['🏪 Danh sách cửa hàng', () => cuaHang()], ...NUT_SAU()] });
  }
  function datTruoc() {
    tra('Dạ em đã chuyển sang tab **Order bánh đặt trước** rồi ạ 📅' + (THONG_TIN.datTruoc ? '\n' + THONG_TIN.datTruoc : '\nAnh/chị chọn bánh rồi nhắn Messenger, nhân viên sẽ tư vấn thời gian nhận bánh phù hợp ạ.'),
      { mood: 'happy', options: [['🎂 Gợi ý bánh sinh nhật', hoiSoNguoi], ...NUT_SAU()] });
  }
  function cuaHang(chiMot) {
    const ds = chiMot ? [chiMot] : CUA_HANG;
    tra((chiMot ? `Dạ đây là cơ sở **${chiMot.ten}** ạ:` : `Dạ The Cake Lab có ${CUA_HANG.length} cơ sở ạ:`) +
      (THONG_TIN.gioMoCua ? `\n🕐 Giờ mở cửa: ${THONG_TIN.gioMoCua}` : ''),
      { stores: ds, mood: 'happy', options: [['🏪 Xem bánh có sẵn', () => { chuyenTab('pickup'); coSan(); }], ...NUT_SAU()] });
  }
  function goiDien() {
    tra('Dạ anh/chị gọi cơ sở gần mình nhất nhé ạ 📞', { stores: CUA_HANG, mood: 'happy', options: [['💬 Nhắn Messenger', gapNhanVien], ['🏠 Menu chính', menuChinh]] });
  }
  function gapNhanVien() {
    theoDoi('gap_nhan_vien');
    tra('Dạ em mở Messenger để anh/chị nhắn trực tiếp với nhân viên The Cake Lab nhé ạ 💬\nAnh/chị cũng có thể gọi hotline của từng cơ sở:',
      { mood: 'love', options: [['💬 Mở Messenger', () => window.open(MESSENGER_URL, '_blank', 'noopener'), true], ['📍 Địa chỉ cửa hàng', () => cuaHang()], ['🏠 Menu chính', menuChinh]],
        stores: CUA_HANG });
    setTimeout(() => window.open(MESSENGER_URL, '_blank', 'noopener'), 900);
  }
  function hoiShop(chuDe, thongTin) {
    if (thongTin) return tra(`Dạ ${thongTin}`, { mood: 'happy', options: NUT_SAU() });
    tra(`Dạ về ${chuDe}, anh/chị nhắn shop qua Messenger để nhân viên báo chính xác nhất ạ 💬`, { mood: 'shy', options: [['💬 Nhắn shop', gapNhanVien, true], ['🏠 Menu chính', menuChinh]] });
  }

  // Tìm bánh theo tên khách gõ
  function timBanh(q) {
    const nq = ' ' + bo(q).replace(/[^a-z0-9 ]/g, ' ') + ' ';
    const BO_QUA = new Set(['banh', 'kem', 'size', 'cho', 'gia', 'bao', 'nhieu', 'co', 'khong', 'mua', 'dat', 'the', 'nao', 'vi', 'loai', 'cake', 'mini', 'sinh', 'nhat']);
    const diem = MENU().map((m) => {
      const ten = bo(m.ten).replace(/[^a-z0-9 ]/g, ' ');
      if (nq.includes(' ' + ten.trim() + ' ')) return [m, 100];
      const tu = ten.split(/\s+/).filter((w) => w.length > 1 && !BO_QUA.has(w));
      const trung = tu.filter((w) => nq.includes(' ' + w + ' ')).length;
      return [m, tu.length ? (trung / tu.length) * 10 + trung : 0];
    }).filter(([, d]) => d >= 5).sort((a, b) => b[1] - a[1]);
    return diem.map(([m]) => m);
  }

  // Hiểu câu khách tự gõ (theo từ khoá, không dùng AI)
  function hieu(q) {
    const t = ' ' + bo(q) + ' ';
    const co = (...ws) => ws.some((w) => t.includes(w));
    const so = (t.match(/(\d{1,3})\s*(nguoi|ng|khach|ban|be|nguoi an)/) || [])[1];

    if (so) {
      const n = +so;
      if (n > 12) return tiecLon();
      return goiYSize(n <= 6 ? 'Family' : n <= 8 ? 'Friends' : 'Party', n);
    }
    // Tên cơ sở (vd "Trung Hòa") không được đem đi so với tên bánh (vd "Hoa Quả")
    const coSo = CUA_HANG.find((c) => c.tuKhoa.some((k) => t.includes(k)));
    const qBanh = CUA_HANG.reduce((x, c) => c.tuKhoa.reduce((y, k) => y.split(k).join(' '), x), t);
    const banh = timBanh(qBanh);
    if (banh.length) {
      const m = banh[0];
      const gia = m.sizes ? m.sizes.map(([s, g]) => `${s} (${SIZE_NGUOI[s] ? SIZE_NGUOI[s].join('–') + ' người' : s}): **${fmt(g)}**`).join('\n') : `Giá: **${fmt(m.gia)}**`;
      return tra(banh.length === 1 || bo(m.ten) === bo(q).trim()
        ? `Dạ **${m.ten}** đây ạ${m.moi ? ' — bánh mới nhà em ✨' : laBest(m) ? ' — bánh bán chạy ⭐' : ''}\n${gia}\nAnh/chị bấm vào bánh để xem chi tiết và đặt nhé:`
        : `Dạ em tìm được mấy bánh này ạ, anh/chị bấm vào để xem chi tiết nhé:`, { cards: banh, mood: 'excited', options: [['📝 Cách đặt bánh', cachDat], ...NUT_SAU()] });
    }
    if (co(' chao', 'hello', ' hi ', ' alo', 'xin chao')) return chao();
    if (co('cam on', 'thank', 'tks', 'camon')) return tra('Dạ không có gì ạ! Chúc anh/chị một ngày thật nhiều may mắn và tài lộc 🐱💕', { mood: 'love', options: NUT_SAU() });
    if (co('hotline', 'so dien thoai', 'sdt', 'goi dien', 'dien thoai', 'so dt')) return coSo ? cuaHang(coSo) : goiDien();
    if (coSo) return cuaHang(coSo);
    if (co('nhan vien', 'tu van vien', 'nguoi that', 'admin', 'messenger', 'inbox')) return gapNhanVien();
    if (co('giao', 'ship', 'van chuyen', 'grab', 'ahamove')) return hoiShop('giao hàng và phí ship', THONG_TIN.giaoHang);
    if (co('thanh toan', 'chuyen khoan', 'tien mat', ' ck ', 'stk', 'tai khoan')) return hoiShop('cách thanh toán', THONG_TIN.thanhToan);
    if (co('gio mo', 'mo cua', 'dong cua', 'may gio', 'gio lam')) return hoiShop('giờ mở cửa', THONG_TIN.gioMoCua ? `cửa hàng mở ${THONG_TIN.gioMoCua} ạ 🕐` : '');
    if (co('dia chi', 'cua hang', 'co so', 'chi nhanh', ' o dau', 'duong di', 'chi duong', 'ban do', 'map')) return cuaHang();
    if (co('dat truoc', 'truoc may ngay', 'bao lau', 'mat bao lau', 'order truoc')) return datTruoc();
    if (co('co san', 'lay ngay', 'mua ngay', 'lay luon')) { chuyenTab('pickup'); return coSan(); }
    if (co('cach dat', 'dat banh', 'dat hang', 'order', 'mua banh', 'dat nhu the nao', 'huong dan')) return cachDat();
    if (co('size', 'family', 'friends', 'party', 'bao nhieu nguoi', 'may nguoi', 'kich thuoc', 'to nho')) return hoiSoNguoi();
    if (co('sinh nhat', 'birthday', ' sn ', 'thoi nen', 'tiec')) return hoiSoNguoi();
    if (co('moi', ' new ')) return banhMoi();
    if (co('ban chay', 'best', 'noi bat', 'ngon nhat', 'goi y', 'tu van', 'nen chon', 'nen mua', 'hot ')) return bestSeller();
    if (co('banh mi', 'do an kem')) return nhomBanh('BÁNH MÌ', 'Dạ đây là bánh mì & đồ ăn kèm nhà em ạ 🥐');
    if (co('cookie', 'banh quy')) return nhomBanh('BÁNH QUY', 'Dạ đây là các loại cookie nhà em ạ 🍪');
    if (co('mini', 'banh kem nho', 'banh nho', 'mot nguoi', '1 nguoi', 'an vat', 'trang mieng')) return nhomBanh('BÁNH KEM NHỎ', 'Dạ đây là bánh kem nhỏ (minicake) — hợp ăn vặt, tráng miệng ạ 🎂');
    if (co('gia', 'bao nhieu tien', 'bn tien', 're nhat', 'dat nhat')) return hoiSoNguoi();
    tra('Dạ em chưa hiểu ý anh/chị lắm ạ 🙈 Anh/chị chọn một mục bên dưới, hoặc nhắn nhân viên để được hỗ trợ ngay nhé!', { mood: 'confused', options: NUT_CHINH() });
  }

  // -------------------------------------------------------------------
  // Mở / đóng và lời chào
  // -------------------------------------------------------------------
  let daChao = false;
  function mo() {
    root.classList.add('tl-open'); an(hint);
    try { sessionStorage.setItem('tl-hint', '1'); } catch (e) {}
    if (!daChao) { daChao = true; chao(); theoDoi('mo'); }
    setTimeout(() => { if (window.innerWidth > 600) input.focus(); }, 250);
  }
  function dong() { root.classList.remove('tl-open'); }
  function an(el) { el.classList.remove('tl-show'); }
  stage.addEventListener('click', () => (root.classList.contains('tl-open') ? dong() : mo()));
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  stage.addEventListener('mouseenter', () => { if (emote === 'neutral') camXuc('happy', 1500); });
  $('#tl-close').addEventListener('click', dong);
  $('#tl-reset').addEventListener('click', () => { log.innerHTML = ''; chips.innerHTML = ''; hangDoi = Promise.resolve(); chao(); });
  hint.addEventListener('click', (e) => { if (e.target.closest('.tl-x')) { an(hint); try { sessionStorage.setItem('tl-hint', '1'); } catch (er) {} } else mo(); });
  $('#tl-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim(); if (!q) return;
    input.value = ''; tinKhach(q); hieu(q); theoDoi('hoi', q.slice(0, 80));
  });
  // Mở cửa sổ chi tiết bánh thì thu Tiểu Lộc lại cho khỏi che
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.product-card') && window.innerWidth <= 600) dong(); }, true);

  // Lời chào nhỏ sau vài giây (mỗi phiên một lần)
  let daHint = false;
  try { daHint = sessionStorage.getItem('tl-hint') === '1'; } catch (e) {}
  if (!daHint) {
    setTimeout(() => {
      if (root.classList.contains('tl-open')) return;
      const h = new Date().getHours();
      const buoi = h < 11 ? 'buổi sáng' : h < 14 ? 'buổi trưa' : h < 18 ? 'buổi chiều' : 'buổi tối';
      hint.querySelector('span').innerHTML = `Chào ${buoi}! Em là <b>Tiểu Lộc</b> 🐱 Anh/chị cần em tư vấn chọn bánh không ạ?`;
      hint.classList.add('tl-show'); camXuc('happy', 2500);
    }, 3500);
  }

  // Thỉnh thoảng liếc mắt cho sinh động
  setInterval(() => {
    if (emote !== 'neutral') return;
    const l = [(Math.random() * 6 - 3).toFixed(1), (Math.random() * 3 - 1.5).toFixed(1)];
    root.querySelectorAll('.tl-look').forEach((el) => (el.style.transform = `translate(${l[0]}px,${l[1]}px)`));
    setTimeout(() => emote === 'neutral' && ve(), 1300);
  }, 7000);

  window.TieuLoc = { mo, dong, hoi: (q) => { mo(); tinKhach(q); hieu(q); } };
})();
