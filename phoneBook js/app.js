function phoneBookRecord(name, phone) {
  this.name = name
  this.phone = phone
}

function PhoneBook() {
  this.records = []

  this.add = function (name, phone) {
      const record = new phoneBookRecord(name, phone)
      this.records.push(record)
  }

  this.search = function (keyword) {
      const filteredRecords = this.records.filter(function (record) {
          return record.name.toLowerCase().includes(keyword.toLowerCase())
      })
      return filteredRecords
  }

  this.remove = function (record) {
      const index = this.records.indexOf(record)
      if (index !== -1) {
          this.records.splice(index, 1)
      }
  }
}

function ElementBuilder(name) {
  this.element = document.createElement(name)

  this.text = function (text) {
      this.element.textContent = text
      return this
  }

  this.type = function (type) {
      this.element.type = type
      return this
  }

  this.appendTo = function (parent) {
      if (parent instanceof ElementBuilder) {
          parent
              .build()
              .appendChild(this.element)
      } else {
          parent.appendChild(this.element)
      }
      return this
  }

  this.placeholder = function (text) {
      this.element.placeholder = text
      return this
  }

  this.hide = function () {
      this.element.style.display = 'none'
      return this
  }

  this.show = function () {
      this.element.style.display = 'block'
      return this
  }

  this.className = function (className) {
      this.element.className = className
      return this
  }

  this.onclick = function (fn) {
      this.element.onclick = fn
      return this
  }

  this.html = function(htmlvalue) {
      this.element.innerHTML = htmlvalue
      return this
  }

  this.value = function(value){
      this.element.value = value
      return this
  }

  this.build = function () {
      return this.element
  }
}

const builder = {
  create: function (name) {
      return new ElementBuilder(name)
  }
}

function Painter(container) {
  const phoneBook = new PhoneBook()
  this.container = container
  let listContainer = null

  function printList(recordsList) {
      listContainer.html('')
      recordsList.forEach(function(record){
          const li = builder
          .create('li')
          .appendTo(listContainer)

         const listItem =  builder
          .create('div')
          .appendTo(li)

          builder
          .create('div')
          .text(`name: ${record.name},  # ${record.phone}`)
          .appendTo(listItem)

           builder
          .create('button')
          .text('x')  
          .appendTo(listItem)
          .onclick(function(){
              phoneBook.remove(record)
              printList(phoneBook.records)
          })
      })
  }

  this.init = function () {
      builder
          .create('h2')
          .text('PhoneBookApp')
          .appendTo(this.container)

      const searchPanel = builder
          .create('div')
          .appendTo(this.container)
          .className('search-panel')

      const searchBox = builder
          .create('div')
          .appendTo(searchPanel)


      const searchInput = builder
          .create('input')
          .type('text')
          .appendTo(searchBox)

      const searchButton = builder
          .create('button')
          .text('Search')
          .appendTo(searchBox)
          .onclick(function(){
              const keyword = searchInput.build().value
              const filterItems = phoneBook.search(keyword)
              printList(filterItems)
          })

      const addButton = builder
          .create('button')
          .text('Add')
          .appendTo(searchBox)
          .onclick(function () {
              searchPanel.hide()
              addPanel.show()
          })

          listContainer = builder
          .create('ul')
          .appendTo(searchPanel)

      const addPanel = builder
          .create('div')
          .appendTo(this.container)
          .hide()

      const addNameInput = builder
          .create('input')
          .type('text')
          .placeholder('Name')
          .appendTo(addPanel)

      builder.create('br').appendTo(addPanel)

      const addPhoneInput = builder
          .create('input')
          .type('text')
          .placeholder('phone')
          .appendTo(addPanel)

      builder.create('br').appendTo(addPanel)

      const saveButton = builder
          .create('button')
          .text('Save')
          .appendTo(addPanel)
          .onclick(function () {
              const name = addNameInput.build().value
              const phone = addPhoneInput.build().value
              phoneBook.add(name,phone)
              printList(phoneBook.records)
              searchPanel.show()
              addPanel.hide()
              addNameInput.value('')
              addPhoneInput.value('')
          })

      const cancelButton = builder
          .create('button')
          .text('Cancel')
          .appendTo(addPanel)
          .onclick(function () {
              searchPanel.show()
              addPanel.hide()
          })
  }
}


const phoneBookContainer = document.getElementById('phone-book-container')
const app = new Painter(phoneBookContainer, PhoneBook)
app.init()