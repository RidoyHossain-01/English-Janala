function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const createElements=(arr)=>{
     const htmlElements = arr.map(el=>`<span class="btn btn-sm rounded-full">${el}</span>`)
     return(htmlElements.join(' '));
}

const manageSpinner=(status)=>{
     if(status){
          document.getElementById('spinner').classList.remove('hidden')
          document.getElementById('word-container').classList.add('hidden')
     }
     else{
        document.getElementById('spinner').classList.add('hidden')
          document.getElementById('word-container').classList.remove('hidden')  
     }
}


const loadLessons = () =>{
     fetch('https://openapi.programming-hero.com/api/levels/all')
     .then(res=>res.json())
     .then(json=>displayLesson(json.data))
}
 const removeActive=()=>{     
     const lessonButtons=document.querySelectorAll('.lesson-btn');
     lessonButtons.forEach(btn=>btn.classList.remove('btn-active'))
     
 }
          
const loadLevelWord=(id)=>{
     manageSpinner(true);
     const url = `https://openapi.programming-hero.com/api/level/${id}`
     fetch(url)
     .then(res=>res.json())
     .then(data=>{
          removeActive()
          const clickBtn=document.getElementById(`lesson-btn-${id}`);
          clickBtn.classList.add("btn-active")
          
          displayLevelWord(data.data)
     })
}

const loadWordDetail=async(id)=>{
     const url = `https://openapi.programming-hero.com/api/word/${id}`;
     const res =await fetch(url);
     const details=await res.json();
     displayWordDetails(details.data);
     
}

const displayWordDetails=(word)=>{
     const detailsBox= document.getElementById('details-container');
     detailsBox.innerHTML=`
           <div>
        <h2 class="text-2xl font-bold">${word.word}( <i class="fa-solid fa-microphone"></i> : ${word.pronunciation})</h2>
      </div>
      <div>
        <h2 class=" font-bold">Meaning</h2>
        <p>${word.meaning}</p>
      </div>
      <div>
        <h2 class=" font-bold">Example</h2>
        <p>${word.sentence}p>
      </div>
      <div>
        <h2 class=" font-bold">Synonyms</h2>
          <div>     
       ${createElements(word.synonyms)}
          </div>
       
      </div>
     `
     document.getElementById('my_modal_5').showModal();
}

const displayLevelWord=(words)=>{
     const levelWordContainer =document.getElementById('word-container');
     levelWordContainer.innerHTML=``;
     if(words.length==0){
         levelWordContainer.innerHTML=`
          <div class="text-center my-auto col-span-full py-5 rounded-xl space-y-4 font-bangla"><i class="fa-solid fa-triangle-exclamation text-6xl text-gray-500"></i>
        <p class="text-xl text-gray-500 ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-black text-3xl">নেক্সট Lesson এ যান</h2>
      </div>
         `;
         manageSpinner(false);
         return;
     }

     words.forEach(word => {
          const card = document.createElement('div');
          card.innerHTML=`
           <div class="bg-white rounded-xl shadow-md text-center py-10 px-5 space-y-5 h-full">
        <h2 class="font-bold text-2xl">${word.word?word.word:'(শব্দ পাওয়া যায়নি) '}</h2>
        <p class="font-semibold">Meaning / Pronunciation</p>
        <div class="text-2xl font-medium font-bangla">${word.meaning?word.meaning:"(অর্থ পাওয়া যায়নি)"}/${word.pronunciation?word.pronunciation:"(উচ্চারণ পাওয়া যায়নি)"}</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${word.id})" class="btn bg-sky-50 hover:bg-sky-200"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${word.word}')" class="btn bg-sky-50 hover:bg-sky-200"><i class="fa-solid fa-volume-high"></i></i></button>
        </div>
      </div>
          `;
     levelWordContainer.appendChild(card)
          
     });
     manageSpinner(false);
     
}



displayLesson=(lessons)=>{
//1. get the container
const levelContainer=document.getElementById('level-container');
levelContainer.innerHTML="";
//2. get into every lesson
for (const lesson of lessons){
     const btnDiv = document.createElement('div');
     btnDiv.innerHTML=`
     <button id='lesson-btn-${lesson.level_no}' onclick='loadLevelWord(${ lesson.level_no})' class="btn btn-outline btn-primary lesson-btn"></i><i class="fa-solid fa-book-open"></i>Lesson-${ lesson.level_no}</button>
     `
     levelContainer.appendChild(btnDiv);
    
     
}
}
loadLessons()
document.getElementById("btn-search").addEventListener('click', ()=>{
     removeActive();
     const input = document.getElementById('input-search');
     const searchValue = input.value.trim().toLowerCase()
     fetch('https://openapi.programming-hero.com/api/words/all')
     .then(res=>res.json())
     .then(data=>{
          const allWords = data.data;
          const filterWords = allWords.filter(word=>word.word.toLowerCase().includes(searchValue))
          displayLevelWord(filterWords);
          
     })
     
})