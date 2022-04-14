// Declarations.................................................
let nav = 0;
let navdaily = 0;
let navweekly = 0;
let clicked = null;
let clickedzone = "monthly";
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []; //lookalde veri varsa çek
let myEvents = [];
let tarih = ''; // local storageda işlem yapılan gün için alan açmak için değişken

const calendarArea = document.querySelector('.calendar-area');
const modal = document.getElementById('modal');
const backDrop = document.getElementById('modalBackDrop');
const weekdays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const dys = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Pzr"];  


// Event Listeners ................................................
document.getElementById('next').addEventListener('click', () => {
  if (clickedzone == "monthly"){  nav++;  load();      }
  if (clickedzone == "weekly"){ navweekly++;  showWeekly(); }
  if(clickedzone == "daily"){ navdaily++; showDaily(); }
});
document.getElementById('prev').addEventListener('click', () => {
  if (clickedzone == "monthly") {nav--; load(); }
  if (clickedzone == "weekly"){ navweekly--;  showWeekly(); }
  if(clickedzone == "daily"){ navdaily--; showDaily();  }
});
document.querySelector(".monthly").addEventListener('click', load);
document.querySelector(".weekly").addEventListener('click', showWeekly);
document.querySelector(".daily").addEventListener('click',showDaily);
document.getElementById('closeButton').addEventListener('click', closeModal)
calendarArea.addEventListener('click', deleteCheck);

load();

// Functions..........................................................
function load() {
  // arayüz başlangıç ayarları
  clickedzone = 'monthly';
  getWeekDays();

  const dt = new Date();
  // sapma ayarı
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateStringFirst = firstDayOfMonth.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  // ayın başındaki boş günler
  const paddingDays = weekdays.indexOf(dateStringFirst.split(" ")[1]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('tr-TR', { month: 'long' })} ${year}`;

  calendarArea.innerHTML = '';
  const calendar = document.createElement('div');
  calendar.classList.add('calendar');
  calendarArea.appendChild(calendar);
  // gün kutucuklarını oluştur, tatrih ata
  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');

  const dayString = `${month + 1}/${i - paddingDays}/${year}`;

  if (i > paddingDays) {
    daySquare.innerText = i - paddingDays;
    daySquare.classList.add('day');

    if (i - paddingDays === day && nav === 0) {
      daySquare.id = 'currentDay';
    }
    daySquare.addEventListener('click', () => openModal(dayString));
  } else {
    daySquare.classList.add('padding');
  }
  calendar.appendChild(daySquare);
  };
}
function getWeekDays() {
    document.getElementById('weekdays').innerHTML = "";
  for (let i = 0; i < dys.length; i++) {
    const weekday = document.createElement('div');
    weekday.innerText = dys[i];
    document.getElementById('weekdays').appendChild(weekday);
  }
}
function showWeekly() {
  clickedzone = 'weekly';
  document.getElementById('weekdays').innerHTML = "";

  const dt = new Date();

  // padding day ve ay sonu artık gün bul
  if (nav !== 0) { dt.setMonth(new Date().getMonth() + nav);}
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfNextMonth = new Date(year, month + 1, 1);
  const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);

  const dateStringFirst = firstDayOfMonth.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const dateStringLast = lastDayOfMonth.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateStringFirst.split(" ")[1]);
  const extraDays = 7 - weekdays.indexOf(dateStringLast.split(" ")[1]) - 1;
  const calendarDays = daysInMonth + paddingDays + extraDays ;

  calendarArea.innerHTML = '';
  let k = paddingDays;
  let l = extraDays;
  const weeklyDivContainer = document.createElement('div');
  weeklyDivContainer.classList.add('weekly-div-container');
  calendarArea.appendChild(weeklyDivContainer);
  let tarihArray = [];
  // bu aydaki hafta sayısı dolunca bir sonraki aya geç
  if(navweekly>calendarDays/7-1){
    dt.setMonth(dt.getMonth()+1);
  }

  // Ayın ilk haftası program içeriği
  if(navweekly == 0){
      for (let i = 0; i < 7; i++) {
        const weeklyEventList = document.createElement("ul");
        weeklyEventList.classList.add('weekly-event-list');
        weeklyDivContainer.appendChild(weeklyEventList);
        tarihArray[i] = '';
        if(k != 0){ // padding day ise 
          k--; 
        }else{
          tarih = `d_${(i+1-paddingDays)}${month+1}${year}`

          // içerik çağır
        let events;
        if(localStorage.getItem(tarih) === null){
          events = [];
          const newWeeklyEvent = document.createElement("li");
          newWeeklyEvent.innerText = '';
          weeklyEventList.appendChild(newWeeklyEvent);
          tarihArray[i] =(`${i+1-paddingDays} ${dt.toLocaleDateString('tr-TR', { month: 'short' })}`);
          } else{
            events = JSON.parse(localStorage.getItem(tarih));
        }
        events.forEach(function(event){   // her eleman için li oluştur, modalda listele
          const newWeeklyEvent = document.createElement("li");
          weeklyEventList.appendChild(newWeeklyEvent);
          newWeeklyEvent.innerText = event;
          weeklyEventList.appendChild(newWeeklyEvent);
          tarihArray[i] =(`${i+1-paddingDays} ${dt.toLocaleDateString('tr-TR', { month: 'short' })}`);
          });
        }

    }
    
    }
  // Ayın son haftası program içeriği
  if(navweekly == calendarDays/7 - 1){
    for (let i = 0; i < 7; i++) {
      const weeklyEventList = document.createElement("ul");
      weeklyEventList.classList.add('weekly-event-list');
      weeklyDivContainer.appendChild(weeklyEventList);

      if(7-i <= l){
        const newWeeklyEvent = document.createElement("li");
        newWeeklyEvent.innerText = '';
        weeklyEventList.appendChild(newWeeklyEvent);

        tarihArray[i] ='';
      }else{
      tarih = `d_${(i) + 7*navweekly-paddingDays -extraDays}${month+1}${year}`
      
        // içerik çağır
      let events;
      if(localStorage.getItem(tarih) === null){
        events = [];
        const newWeeklyEvent = document.createElement("li");
        newWeeklyEvent.innerText = '';
        weeklyEventList.appendChild(newWeeklyEvent);
        tarihArray[i] =(`${i+2+ 7*navweekly-paddingDays-extraDays} ${dt.toLocaleDateString('tr-TR', { month: 'short' })}`);

      } else{
          events = JSON.parse(localStorage.getItem(tarih));
          //document.querySelector('.modalList').innerHTML = ''; //eski içeriği temizle
      }
      events.forEach(function(event){   // her eleman için li oluştur, modalda listele
        const newWeeklyEvent = document.createElement("li");
        newWeeklyEvent.innerText = event;
        weeklyEventList.appendChild(newWeeklyEvent);
        tarihArray[i] =(`${i+1+ 7*navweekly-paddingDays-extraDays} ${dt.toLocaleDateString('tr-TR', { month: 'short' })}`);
        });
      }
  }
  }
  // Ara haftalar program içeriği
  if(navweekly != 0 && navweekly != calendarDays/7 - 1){
    for (let i = 0; i < 7; i++) {
      const weeklyEventList = document.createElement("ul");
      weeklyEventList.classList.add('weekly-event-list');
      weeklyDivContainer.appendChild(weeklyEventList);

      tarih = `d_${(i+1-paddingDays) + 7*navweekly}${month+1}${year}`
      
        // içerik çağır
      let events;
      if(localStorage.getItem(tarih) === null){
        events = [];
        const newWeeklyEvent = document.createElement("li");
        newWeeklyEvent.innerText = '';
        weeklyEventList.appendChild(newWeeklyEvent);
        tarihArray[i] =(`${(i+1-paddingDays) + 7*navweekly} ${dt.toLocaleDateString('tr-TR', { month: 'short' })}`);

      } else{
          events = JSON.parse(localStorage.getItem(tarih));
      }
      events.forEach(function(event){   // her eleman için li oluştur, listele
        const newWeeklyEvent = document.createElement("li");
        newWeeklyEvent.innerText = event;
        weeklyEventList.appendChild(newWeeklyEvent);
        tarihArray[i] =(`${(i+1-paddingDays) + 7*navweekly} ${dt.toLocaleDateString('tr-TR', { month: 'short' })}`);
        });
    }
  }
  // gün-ay-haftanın günü içeriklerini başlığa yazdır
  for (let i = 0; i < 7; i++) {
    const myDate = document.createElement('div');
    myDate.innerText = tarihArray[i] + " "+ dys[i];
    document.getElementById('weekdays').appendChild(myDate);
  }
}
function showDaily() {

  clickedzone = "daily";
  // ..Seçili tarihi yadırma
  const dt = new Date();

  if (navdaily !== 0) {
    dt.setDate(new Date().getDate() + navdaily); // İçinde bulunulan günden sapma miktarı
  }
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const weekday = dt.getDay();

  document.getElementById('monthDisplay').innerText = `${day} ${dt.toLocaleDateString
    ('tr-TR', { month: 'long' })} ${year} - ${dt.toLocaleDateString('tr-TR', { weekday: 'long' })}`;
  document.getElementById('weekdays').innerHTML = '&nbsp&nbsp&nbspGünlük Program';
  document.getElementById('weekdays').style.fontSize = '1.5rem'; 

  // ..ADDING elemanlarının oluşturuma, calendarArea alanına yazdırma
  calendarArea.innerHTML = '';

  const addEvent = document.createElement('div');
  addEvent.classList.add('addEvent');
  const addText = document.createElement('input');
  addText.placeholder = "Yeni plan yazınız.."
  const addBtn = document.createElement('button');
  addBtn.innerText = "+";
  addBtn.classList.add('addBtn');
  
  addEvent.appendChild(addText);
  addEvent.appendChild(addBtn);
  calendarArea.appendChild(addEvent);

  tarih = `d_${day}${month+1}${year}`

  getLocalEvents();

  // ..plan ekleme butonu
  addBtn.addEventListener('click', () => {

    saveLocalEvents(addText.value);

    // div creation
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('eventDiv');
  
    //li creation
    const newEvent = document.createElement("li");
    newEvent.innerText = addText.value;
    eventDiv.appendChild(newEvent);

    //trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = "<i class = 'fas fa-trash'></i>"
    trashButton.classList.add("trsButton");
    eventDiv.appendChild(trashButton);

    calendarArea.appendChild(eventDiv);
    addText.value = '';
  });
}
function openModal(date) {
  
  clicked = date;

  // tarihi g/a/y formatına çevir
  splitDate = clicked.split('/');
  splitDate.splice(0, 0, splitDate[1]);
  splitDate.splice(2, 1);
  tarih = 'd_'+(splitDate).join('');
  console.log(tarih);

  // modal görünürlüğünü aç
  modal.style.visibility = 'visible';
  modal.style.opacity = 1;

  backDrop.style.visibility = 'visible';
  backDrop.style.opacity = 1;

  // içerik çağır
  let events;
  if(localStorage.getItem(tarih) === null){
    document.querySelector('.modalList').innerHTML = 'Henüz bir planın yok..';
    events = [];
  } else{
      events = JSON.parse(localStorage.getItem(tarih));
      document.querySelector('.modalList').innerHTML = ''; //eski içeriği temizle
  }
  events.forEach(function(event){

  // her eleman için li oluştur, modalda listele
  const newModalEvent = document.createElement("li");
  newModalEvent.innerText = event;
  newModalEvent.classList.add('modalEventList');
  document.querySelector('.modalList').appendChild(newModalEvent);
  });
}
function closeModal() {
  modal.style.visibility = 'hidden';
  backDrop.style.visibility = 'hidden';
  modal.style.opacity = 0;
  backDrop.style.opacity = 0;
  clicked = null;
  load();
}
function saveLocalEvents(event){
  // data kontrol
  let events;
  if(localStorage.getItem(tarih) === null){
      events = [];
  }else{
      events = JSON.parse(localStorage.getItem(tarih));
  }
  events.push(event);   // event ekle
  localStorage.setItem(tarih, JSON.stringify(events)); //kaydet
}
function getLocalEvents(event){
  // data kontrol
  let events;
  if(localStorage.getItem(tarih) === null){
      events = [];
  }else{
      events = JSON.parse(localStorage.getItem(tarih));
  }

  events.forEach(function(event){
      //event div creation
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("eventDiv");

  //li creation
  const newEvent = document.createElement("li");
  newEvent.innerText = event;
  eventDiv.appendChild(newEvent);

  //trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = "<i class = 'fas fa-trash'></i>"
  trashButton.classList.add("trsButton");
  eventDiv.appendChild(trashButton);

  //append to list
  calendarArea.appendChild(eventDiv);
  })
}
function deleteCheck(e){
  const item = e.target;
  const event = item.parentElement;
   //delete
   if (item.classList[0] === "trsButton"){
       event.classList.add("fall");
       removeLocalEvents(event);
       event.addEventListener("transitionend", function(){
          event.remove();
       })
   }
}
function removeLocalEvents(event){
  //check
  let events;
  if(localStorage.getItem(tarih) === null){
      events = [];
  }else{
      events = JSON.parse(localStorage.getItem(tarih));
  }
  // events içerisinden ilgili indexteki elemanı ayır yeniden locale kaydet
  const eventIndex = event.children[0].innerText;
  events.splice(events.indexOf(eventIndex), 1);
  localStorage.setItem(tarih, JSON.stringify(events));
}

