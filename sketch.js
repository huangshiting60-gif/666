let capture;
let pg;

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
}

function draw() {
  // 設定畫布的背景顏色為 #e7c6ff
  background('#e7c6ff');
  
  // 計算影像的顯示大小為整個畫布寬高比例的 60%
  let imgWidth = width * 0.6;
  let imgHeight = height * 0.6;
  
  // 將擷取的攝影機影像繪製在畫布的正中間，並修正左右顛倒的問題
  push();
  translate(width / 2, height / 2); // 將畫布原點移動到中心
  scale(-1, 1); // 進行水平翻轉
  image(capture, 0, 0, imgWidth, imgHeight); // 原點已在中心，繪製於 (0, 0)
  pop();
  
  // 在 pg 上面繪製內容（範例：黃色粗邊框與置中文字）
  pg.clear(); // 每一幀清空背景保持透明，避免殘影
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
