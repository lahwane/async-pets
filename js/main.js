import { petService } from './services/pet.service.js'

window.onLoadPets = onLoadPets
window.onLoadPet = onLoadPet
window.onRemovePet = onRemovePet
window.onAddPet = onAddPet
window.onUpdatePet = onUpdatePet

function onLoadPets() {
    console.log('Loading pets...')
    loadPets()
}

function onLoadPet() {
    const petId = prompt('Enter pet id')
    petService.get(petId)
        .then(render)
}

function onRemovePet() {
    const petId = prompt('Enter pet id')
        petService.remove(petId)
            .then(loadPets)
}

function onAddPet() {
    const petName = prompt('Enter pet name')
    const pet = petService.getEmptyPet(petName)

    petService.save(pet)
        .then(loadPets)
}
    
function onUpdatePet() {
    const petId = prompt('Enter pet id')

    petService.get(petId)
        .then(pet => {
            pet.score = +prompt('Enter new score')
            return petService.save(pet)
        })
        .then(loadPets)
    }

function render(data) {
    const petsStr = JSON.stringify(data, null, 4)
    document.querySelector('.data').innerText = petsStr
}

function loadPets() {
    petService.query({ minScore: 10 })
        .then(render)
}