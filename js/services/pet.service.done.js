import { makeId, randomPetName, randomPetType, randomPastTime } from './util.service.js'
import { storageService } from './async-storage.service.js'

const PET_KEY = 'petDB'

_createPets()

export const petService = {
	query,
	get,
	remove,
	save,
	getEmptyPet,
}

function query(filterBy = {}) {
	return storageService.query(PET_KEY)
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
	return storageService.get(PET_KEY, petId)
}

function remove(petId) {
	return storageService.remove(PET_KEY, petId)
}

function save(pet) {
	if (pet.id) {
		return storageService.put(PET_KEY, pet)
	} else {
		return storageService.post(PET_KEY, pet)
	}
}

function getEmptyPet(name = '', score = 0) {
	return { id: '', name, score }
}

function _createPets() {
	let pets = loadFromStorage(PET_KEY)
	if (!pets || !pets.length) {
		_createDemoPets()
	}
}

function _createDemoPets() {
	const petNames = ['Bobi', 'Charli', 'Pinchi']
	const petDescs = ['Bobi is an amazing dog', 'Charli is a curious cat', 'Just one look at Pinchi']

	const pets = petNames.map((petName, i) => {
		const pet = _createPet(petName)
		pet.desc = petDescs[i]
		return pet
	})

	saveToStorage(PET_KEY, pets)
}

function _createPet(name) {
	const pet = getEmptyPet()
	pet.id = makeId()
	pet.type = randomPetType()
	pet.name = name || randomPetName(pet.type)
	pet.birth = randomPastTime()
	return pet
}