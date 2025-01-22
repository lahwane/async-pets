import { storageService } from './async-storage.service.js'
import { makeId, randomPetType, randomPetName, randomPastTime, loadFromStorage, saveToStorage, getRandomIntInclusive } from './util.service.js'

export const petService = {
	query,
	get,
	remove,
    save,
	getEmptyPet,
}

const STORAGE_KEY = 'pet'
_createPets()

function query(filterBy = {}) {
    return storageService.query(STORAGE_KEY)
        .then(pets => {
            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                pets = pets.filter(pet => regex.test(pet.name))
            }
            if (filterBy.minScore) {
                pets = pets.filter(pet => pet.score >= filterBy.minScore)
            }
            return pets
        })
}

function get(petId) {
    return storageService.get(STORAGE_KEY, petId)
}

function remove(petId) {
    return storageService.remove(STORAGE_KEY, petId)
}

function save(pet) {
    if (pet.id) {
        return storageService.put(STORAGE_KEY, pet)
    } else {
        return storageService.post(STORAGE_KEY, pet)
    }
}

function getEmptyPet(name = '', score = 0) {
	return { id: '', name, score }
}

function _createPets() {
	const pets = loadFromStorage(STORAGE_KEY)
	if (!pets || pets.length === 0) _createDemoPets()
}

function _createDemoPets() {
	const petNames = ['Bobi', 'Charli', 'Pinchi']
	const petDescs = ['Bobi is an amazing dog', 'Charli is a curious cat', 'Just one look at Pinchi']

	const pets = petNames.map((petName, i) => {
		const pet = _createPet(petName)
		pet.desc = petDescs[i]
		return pet
	})

	saveToStorage(STORAGE_KEY, pets)
}

function _createPet(name) {
	const pet = getEmptyPet()

	pet.id = makeId()
	pet.name = name || randomPetName(pet.type)
	pet.type = randomPetType()
	pet.birth = randomPastTime()
	pet.score = getRandomIntInclusive(1, 10)
	
    return pet
}