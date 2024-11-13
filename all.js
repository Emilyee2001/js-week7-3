// axios請求資料
// 渲染全部資料到畫面
// 篩選套票並渲染畫面
// 新增卡片 並 驗證，驗證成功渲染畫面
// validate.js套件寫驗證條件，驗證失敗顯示alert
// c3.js套件渲染chart到畫面 => 綁定渲染全部資料到畫面功能 => 新增or篩選資料即渲染

// 套票卡片區
const ticketCardArea = document.querySelector('.ticketCard-area');

// 搜尋區
const regionSearch = document.querySelector('.regionSearch');
const searchResultText = document.querySelector('#searchResult-text');

// 查無關鍵字區
const cantFindArea = document.querySelector('.cantFind-area');

// 新增套票區
const addTicketForm = document.querySelector('.addTicket-form');
const addTicketBtn = document.querySelector('.addTicket-btn');
const addTicketName = document.querySelector('#ticketName');
const addTicketImgUrl = document.querySelector('#ticketImgUrl');
const addTicketRegion = document.querySelector('#ticketRegion');
const addTicketPrice = document.querySelector('#ticketPrice');
const addTicketNum = document.querySelector('#ticketNum');
const addTicketRate = document.querySelector('#ticketRate');
const addTicketDescriptione = document.querySelector('#ticketDescription');


let dataUrl = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';


function runTravelData(dataUrl){
  axios.get(dataUrl).then(response => {
    let travelData = response.data.data;
    renderData(travelData);
    areaFilter(travelData);
    addCard(travelData);
  }).catch(error => {
    console.log(error.message);
  })
}

// 渲染全部資料到畫面功能
function renderData(data){
  data.length === 0 ? cantFindArea.style.display = 'block' : cantFindArea.style.display = 'none';
  let cardContent = '';
  data.forEach(item => {
    let cardTemplate = `<li class="ticketCard">
    <div class="ticketCard-img">
      <a href="#">
        <img src="${item.imgUrl}" alt="${item.name}">
      </a>
      <div class="ticketCard-region">${item.area}</div>
      <div class="ticketCard-rank">${item.rate}</div>
    </div>
    <div class="ticketCard-content">
      <div>
        <h3>
          <a href="#" class="ticketCard-name">${item.name}</a>
        </h3>
        <p class="ticketCard-description">
          ${item.description}
        </p>
      </div>
      <div class="ticketCard-info">
        <p class="ticketCard-num">
          <span><i class="fas fa-exclamation-circle"></i></span>
          剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
        </p>
        <p class="ticketCard-price">
          TWD <span id="ticketCard-price">$${item.price}</span>
        </p>
      </div>
    </div>
    </li>`;
    cardContent += cardTemplate;
  });
  ticketCardArea.innerHTML = cardContent;
  searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`;
  renderChart(data);
}

// 篩選套票功能並渲染畫面
function areaFilter(data){
  regionSearch.addEventListener('change',() => {
    let searchResult = [];
    data.forEach(item => {
      if(regionSearch.value === item.area){
        searchResult.push(item);
      }else if(regionSearch.value === '全部地區'){
        searchResult.push(item);
      }
    })
    renderData(searchResult);
  })
}

// 新增卡片功能及驗證，驗證成功渲染畫面
function addCard(data){
  addTicketBtn.addEventListener('click',() => {
    let obj = {};
    obj.id = Number(data.length);
    obj.name = addTicketName.value.trim();
    obj.imgUrl = addTicketImgUrl.value.trim();
    obj.area = addTicketRegion.value;
    obj.group = Number(addTicketNum.value);
    obj.price = Number(addTicketPrice.value);
    obj.rate = Number(addTicketRate.value);
    obj.description = addTicketDescriptione.value.trim();
    if(!formVerify()){
      data.push(obj);
      renderData(data);
      regionSearch.value = '全部地區';
      addTicketForm.reset();
    }
  })
}

// 驗證條件，未通過執行alert message
function formVerify(){
  const constraints = {
    '套票名稱':{
      presence:{
        message:'必填', 
      }
    },
    '圖片網址':{
      presence:{
        message:'必填', 
      },
    },
    '景點地區':{
      presence:{
        message:'必填', 
      },
    },
    '套票金額':{
      presence:{
        message:'必填', 
      },
    },
    '套票組數':{
      presence:{
        message:'必填', 
      },
    },
    '套票星級':{
      presence:{
        message:'必填', 
      },
    },
    '套票描述':{
      presence:{
        message:'必填', 
      },
      length:{
        maximum: 100,
        message: '套票描述限 100 字',
      }
    }
  }
  const errors = validate(addTicketForm,constraints);
  if(errors){
    let errorMsg = '';
    let errorArr = Object.keys(errors);
    errorArr.forEach(errorItem => {
      errorMsg += `${errorItem} `;
    })
    alert(`${errorMsg} 輸入有誤 或 未填寫`);
  }
  return errors;
}

// c3.js套件渲染chart到畫面
function renderChart(data){
  let areaTotalObj = {};
  data.forEach(item => {
    if(!areaTotalObj[item.area]){
      areaTotalObj[item.area] = 1;
    }else{
      areaTotalObj[item.area] ++;
    }
  })
  let areaTotalObjKeys = Object.keys(areaTotalObj);
  let areaArrForC3 = [];
  areaTotalObjKeys.forEach(item => {
    let areaArr = [];
    areaArr.push(item);
    areaArr.push(areaTotalObj[item]);
    areaArrForC3.push(areaArr); 
  })
  const chart = c3.generate({
    data: {
        columns: areaArrForC3,
        type : 'donut',
        colors: {
          '台北': '#26C0C7',
          '台中': '#5151D3',
          '高雄': '#E68619',
        },
    },
    donut: {
        title: "套票地區比重",
        width: 15,
        label: {
          show: false,
        },
    },
    size: {
      width: 200,
      height: 200,
    }
});
}

// 執行
runTravelData(dataUrl);