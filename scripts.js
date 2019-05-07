const button = document.querySelector('button')
let input = document.querySelector('.input')
let countryShortcut = ''
let countryName = ''

button.addEventListener('click', (e) => {
  switch (input.value) {
    case "France":
      countryName = "France"
      countryShortcut = "FR"
      countryCities()
      break
    case "Germany":
      countryName = "Germany"
      countryShortcut = "DE"
      countryCities()
      break
    case "Poland":
      countryName = "Poland"
      countryShortcut = "PL"
      countryCities()
      break
    case "Spain":
      countryName = "Spain"
      countryShortcut = "ES"
      countryCities()
      break
    default:
      alert("Please choose one of the countries: France, Germany, Poland, Spain.")
      break
  }
  localStorage.setItem('country', JSON.stringify(countryShortcut))      // Collecting data to storage [0]
  localStorage.setItem('countryName', JSON.stringify(countryName))      // Collecting data to storage [1]
})


lastCountryData()                                                       // Rendering data from storage [0]
function lastCountryData() {
  if (localStorage.getItem("country") !== null) {
    let lastCountryData = JSON.parse(window.localStorage.getItem('country'))
    countryShortcut = lastCountryData
    countryCities()
  }
}

countryNamePrint()                                                      // Rendering data from storage [1]
function countryNamePrint() {
  if (localStorage.getItem("countryName") !== null) {
    let countryName = JSON.parse(window.localStorage.getItem('countryName'))
    let idHeading = document.getElementById('countryName')
    idHeading.innerText = countryName;
  }
}




function countryCities() {                                              // Rendering cities
  fetch(`https://api.openaq.org/v1/latest?country=${countryShortcut}&limit=30&parameter=pm25&order_by=measurements[0].value&sort=desc`)
    .then((resp) => resp.json())
    .then(function (data) {
      // const dataPollution = data.results.map(result => result.measurements[0].value)
      // console.log(dataPollution)                                     //Pollution data
      const cities = new Set(data.results.map(result => result.city))   // Creating city array
      const citiesArray = Array.from(cities).slice(0, 10)               // Reducing city array to 10
      const ul = document.querySelector('ul')

      citiesArray.forEach(city => {
        let li = createNode('li')                                       // Creating list elements
        li.className = "countries__list"
        append(ul, li)

        let h3 = createNode('h3')                                       // Creating heading elements
        append(li, h3)
        const fixCitisName = city.replace(/CCAA |Com. |Cast. |Valencia\/|AIR |ATMO /gi, "")
        h3.textContent = fixCitisName

        let div = createNode('div')
        div.className = "countries__wrapper"                            // Creating div elements
        append(li, div)

        let p = createNode('p')
        p.className = "countries__wrapper__description"                 // Creating paragraph elements
        append(div, p)


        h3.addEventListener('click', (e) => {                           // Adding description to each city
          let cityDescription = e.target.textContent
          let citiName = h3.parentElement.getElementsByTagName('p')[0];
          if (citiName.textContent == '') {
            fetch(`https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${cityDescription}`)
              .then(data => data.json())
              .then(data => {
                let page = data.query.pages
                let pageId = Object.keys(page)[0]
                let content = page[pageId].extract
                citiName.textContent = content
                const strippedContent = content.replace(/(<([^>]+)>)/ig, "")
                return strippedContent
              })
              .catch(error =>
                citiName.textContent = `The city has no description on the wiki. Try to check another city.`)
              .then(result =>
                citiName.classList.toggle('show-description'))
          }
          else {
            citiName.classList.toggle('show-description')
          }


        })
      })

      remuvingLastCities()
    })
}

function remuvingLastCities() {
  let li = document.getElementsByClassName('countries__list')
  if (li.length > 10) {
    while (li.length > 10) {
      li[0].parentNode.removeChild(li[0])                               // Remuving last render cities
    }
  }
}


function createNode(element) {
  return document.createElement(element)                                // Create the type of element you pass in the parameters
}

function append(parent, el) {
  return parent.appendChild(el)                                         // Append the second parameter(element) to the first one
}





$(document).ready(function () {                                         // Autocomplete input
  let buah = ["France", "Germany", "Poland", "Spain"]
  console.log(buah)

  $('#name').autocomplete({
    lookup: buah
  })
  $('#name').keyup(function(event) {
    let textBox = event.target;
    let start = textBox.selectionStart;
    let end = textBox.selectionEnd;
    textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1).toLowerCase();
    textBox.setSelectionRange(start, end);
  })
})