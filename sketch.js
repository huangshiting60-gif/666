let capture;
let pg;
let bubbles = []; // 建立一個陣列來儲存泡泡物件
let currentFilter = 'none'; // 儲存目前的濾鏡狀態

function setup() {
  // 第一步驟：產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML 影片元素，因為我們只想把影像繪製在 Canvas 畫布上
  capture.hide();
  
  // 將影像的繪製模式設定為 CENTER，這樣座標就會從影像的正中心點計算，方便置中
  imageMode(CENTER);
  
  // 產生一個與視訊畫面顯示大小相同的 graphics 物件
  pg = createGraphics(width * 0.6, height * 0.6);
  
  // 產生初始的 80 個泡泡
  for (let i = 0; i < 80; i++) {
    bubbles.push({
      x: random(width * 0.6), // 初始位置限制在視訊畫面的寬度內
      y: random(height * 0.6), // 初始位置限制在視訊畫面的高度內
      size: random(10, 40),
      speed: random(1, 3),
      offset: random(TWO_PI) // 給予每個泡泡不同的搖擺起點
    });
  }

  // 建立按鈕美化的 CSS 樣式（半透明圓角玻璃質感）
  let style = document.createElement('style');
  style.innerHTML = `
    .custom-btn {
      background: rgba(255, 255, 255, 0.5);
      border: 2px solid #fff;
      border-radius: 25px;
      padding: 8px 16px;
      font-size: 15px;
      font-weight: bold;
      color: #555;
      cursor: pointer;
      backdrop-filter: blur(4px); /* 毛玻璃效果 */
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .custom-btn:hover {
      background: rgba(255, 255, 255, 0.9);
      color: #ff85a2; /* 滑鼠移過去文字會變馬卡龍粉 */
      transform: translateY(-3px); /* 向上浮起效果 */
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
  `;
  document.head.appendChild(style);

  // 建立濾鏡選擇與擷取畫面按鈕，套用 custom-btn 樣式並調整間距
  let btnNormal = createButton('正常');
  btnNormal.position(20, 20);
  btnNormal.class('custom-btn');
  btnNormal.mousePressed(() => currentFilter = 'none');

  let btnGray = createButton('灰階');
  btnGray.position(110, 20);
  btnGray.class('custom-btn');
  btnGray.mousePressed(() => currentFilter = 'grayscale(100%)');

  let btnInvert = createButton('負片');
  btnInvert.position(200, 20);
  btnInvert.class('custom-btn');
  btnInvert.mousePressed(() => currentFilter = 'invert(100%)');

  let btnSepia = createButton('復古');
  btnSepia.position(290, 20);
  btnSepia.class('custom-btn');
  btnSepia.mousePressed(() => currentFilter = 'sepia(100%)');

  let btnCapture = createButton('📸 擷取畫面');
  btnCapture.position(380, 20);
  btnCapture.class('custom-btn');
  btnCapture.mousePressed(() => saveCanvas('my_snapshot', 'png'));
}

function draw() {
  // 使用 Canvas 原生 API 繪製漸層背景，讓畫面變得更豐富
  let ctx = drawingContext;
  let grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#ffb3ba'); // 頂部馬卡龍粉
  grad.addColorStop(0.5, '#e7c6ff'); // 中間馬卡龍紫
  grad.addColorStop(1, '#bae1ff'); // 底部馬卡龍藍
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  
  // 計算影像的顯示大小為整個畫布寬高比例的 60%
  let imgWidth = width * 0.6;
  let imgHeight = height * 0.6;
  
  // 將擷取的攝影機影像繪製在畫布的正中間，並修正左右顛倒的問題
  push();
  translate(width / 2, height / 2); // 將畫布原點移動到中心
  scale(-1, 1); // 進行水平翻轉
  drawingContext.filter = currentFilter; // 套用選擇的濾鏡
  image(capture, 0, 0, imgWidth, imgHeight); // 原點已在中心，繪製於 (0, 0)
  drawingContext.filter = 'none'; // 恢復濾鏡設定，以免影響後面的背景與泡泡
  pop();
  
  // 在 pg 上面繪製內容（範例：黃色粗邊框與置中文字）
  pg.clear(); // 每一幀清空背景保持透明，避免殘影
  
  // 繪製並更新泡泡效果（將泡泡限制在 pg，也就是視訊畫面範圍內）
  pg.push();
  pg.stroke(255, 150); // 泡泡的邊框（白色，半透明）
  pg.strokeWeight(2);
  pg.fill(255, 50); // 泡泡內部填色（更透明的白色）
  for (let b of bubbles) {
    pg.circle(b.x, b.y, b.size);
    b.y -= b.speed; // 泡泡往上升
    b.x += sin(frameCount * 0.02 + b.offset) * 1.5; // 利用 sin 函數產生左右輕微搖擺
    
    // 如果飄出 pg 上方，讓泡泡從 pg 底部重新出現
    if (b.y < -b.size) {
      b.y = pg.height + b.size;
      b.x = random(pg.width); // 出現的位置也限制在 pg 的寬度內
    }
  }
  pg.pop();

  pg.stroke(255, 255, 0); // 黃色邊線
  pg.strokeWeight(10);
  pg.noFill();
  pg.rect(0, 0, pg.width, pg.height);
  pg.fill(255);
  pg.noStroke();
  pg.textAlign(CENTER, CENTER);
  pg.textSize(32);
  pg.text('Graphics on Top', pg.width / 2, pg.height / 2);
  
  // 將 pg 繪製在視訊畫面的上方（放在 pop() 之後確保文字與圖形不會跟著左右顛倒）
  image(pg, width / 2, height / 2, imgWidth, imgHeight);
}

// 額外加入這個函式：當瀏覽器視窗大小改變時，畫布也會自動調整以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 確保瀏覽器改變尺寸時，pg 的大小也能同步更新為畫布的 60%
  pg.resizeCanvas(windowWidth * 0.6, windowHeight * 0.6);
}
