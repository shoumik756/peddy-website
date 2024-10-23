// categories
const loadCategories = () => {

    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((error) => console.log(error));
}

// active button remove
const removeActive = () => {
    const buttons = document.getElementsByClassName("category-btn");

    for (let btn of buttons) {
        btn.classList.remove("active")
    }

}

// Fetch Pets by Category
const loadCategoriesPet = (id) => {
    const spinner = document.getElementById('spinner');
    const allPetsContainer = document.getElementById("allPets");
    const ingContainer = document.getElementById("imageContainer");
    allPetsContainer.innerHTML = ''; 
    allPetsContainer.classList.add('hidden'); 
    ingContainer.classList.add('hidden'); 
    spinner.classList.remove('hidden');
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
            removeActive();
            const activeBtn = document.getElementById(`btn-${id}`);
            activeBtn.classList.add("active");
            setTimeout(() => {
                displayAllpets(data.data);
                allPetsContainer.classList.remove('hidden');
                ingContainer.classList.remove('hidden');
                spinner.classList.add('hidden');
            }, 2000);
        })
        .catch((error) => {
            console.log(error);
            allPetsContainer.classList.remove('hidden');
            ingContainer.classList.remove('hidden');
            spinner.classList.add('hidden');
        });
}

const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById("categories")
    categories.forEach((item) => {
        const div = document.createElement('div')
        div.innerHTML = `
            <button id="btn-${item.category}" onclick="loadCategoriesPet('${item.category}')" class="category-btn flex justify-center items-center border-[1px] w-full lg:w-[280px] h-[100px] gap-5 rounded-2xl">
            <img class="w-[56px] h-[56px]" src="${item.category_icon}" alt="">
            <p class="text-[24px] font-bold">${item.category} </p>
            </button>
        `

        categoriesContainer.append(div)


    });

}

// fetch all pets
const loadAllPets = () => {

    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then((res) => res.json())
        .then((data) => displayAllpets(data.pets))
        .catch((error) => console.log(error));
}

const displayAllpets = (pets) => {
    const allPetsContainer = document.getElementById("allPets");
    allPetsContainer.innerHTML = '';
    if (pets.length === 0) {
        allPetsContainer.innerHTML = `
        <div class="flex justify-center items-center flex-col gap-5 lg:w-[970px] px-10 py-24 rounded-2xl bg-gray-100"> 

            <div class=" flex justify-center items-center mb-6"><img
                         src="images/error.webp" alt="">
            </div> 
                <h1
                    class="text-[30px] text-textcolor lg:text-[32px] font-black text-center">
                    No Information Available</h1>
                <p class="text-[16px] text-textcolor font-medium text-center my-6">Sorry! Right now we cann't show you any information in BIRDS category. As soon as possible we added a lot of birds in this BIRDS category. For now please choose any other pets form other categories.</p>
            
        </div>
        `;
        return;
    }
    pets.forEach(pet => {
        const card = document.createElement("div");
        card.innerHTML = `
          <div class="p-5 card border-[1px] space-y-5">
                        <div class="h-[200px]">
                            <img class="rounded-xl w-full h-full object-cover" src=${pet.image} alt="" />
                        
                        </div>
                        <div class="mt-5">
                            <div class="border-b pb-5 mb-5 space-y-3">
                                <h3 class="text-xl font-bold">${pet.pet_name}</h3>
                                <p><i class="fas fa-th-large mr-2" ></i>Breed: ${pet.breed ? pet.breed : "N/A"}</p>
                                <p><i class="fa-regular fa-calendar mr-2"></i>Birth: ${pet.date_of_birth ? pet.date_of_birth : "N/A"}</p>
                                <p><i class="fa-solid fa-mercury mr-2"></i>Gender: ${pet.gender ? pet.gender : "N/A"}</p>
                                <p><i class="fa-solid fa-dollar-sign mr-2"></i>Price: ${pet.price ? pet.price : "N/A"}</p>
                            </div>
                            <div class="flex justify-between">
                                <button onclick="likeButton('${pet.image}')" class="hover:bg-primary hover:text-white border-[1px] rounded-lg w-[56px] h-[38px]"><i class="fa-regular fa-thumbs-up"></i></button>
                                <button onclick="adoptButton()" class="hover:bg-primary hover:text-white text-[18px] font-bold text-primary border-[1px] rounded-lg w-[90px] h-[38px]">Adopt</button>
                                <button onclick="petModal('${pet.petId}')" class="hover:bg-primary hover:text-white text-[18px] font-bold text-primary border-[1px] rounded-lg w-[90px] h-[38px]">Details</button>
                            </div>
                        </div>
                    </div>
        `
        allPetsContainer.append(card)
    })

}

//sort pets by price in descending order
const sortByPrice = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then((res) => res.json())
        .then((data) => {
            const pets = data.pets;
            pets.sort((a, b) => b.price - a.price);
            displayAllpets(pets);
        })
        .catch((error) => console.log(error));
}
document.getElementById('sortButton').addEventListener('click', sortByPrice);



// adopt modal count down
const adoptButton = () => {
    const modal = document.getElementById('closeModal');
    const countDownModal = document.getElementById('countdown');
    let n = 3;
    countDownModal.textContent = n;
    modal.showModal();
    const countDownModalInterval = setInterval(() => {
        n--;
        countDownModal.textContent = n;
        if (1 >= n) {
            clearInterval(countDownModalInterval);
            modal.close();
        }
    }, 1000);
};

// like button 
const likeButton = (image) => {
    const allImageContainer = document.getElementById('imageContainer');
    const div = document.createElement('div')
    div.innerHTML = `
    <div class="p-2 border-[1px] rounded-2xl">
    <img class="rounded-xl w-full h-full object-cover" src=${image} alt="" />
    </div>
    `
    allImageContainer.append(div)
}

// modal
const petModal = (petid) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petid}`)
        .then((res) => res.json())
        .then((data) => displayModal(data.petData))
        .catch((error) => console.log(error));

}

const displayModal = (petData) => {
    const modalContainer = document.getElementById('modal-content');
    modalContainer.innerHTML = `
        <div class="h-[200px]">
                            <img class="rounded-xl w-full h-full object-cover" src=${petData.image} alt="" />
                        
                        </div>
                        <div class="mt-5">
                            <div class="border-b pb-5 mb-5 space-y-3">
                                <h3 class="text-xl font-bold">${petData.pet_name}</h3>
                                <div class="flex gap-10">
                                    <div>
                                        <p><i class="fas fa-th-large mr-2" ></i>Breed: ${petData.breed ? petData.breed : "N/A"}</p>
                                        <p><i class="fa-solid fa-mercury mr-2"></i>Gender: ${petData.gender ? petData.gender : "N/A"}</p>
                                        <p><i class="fa-solid fa-syringe mr-2"></i>Vaccinated status: ${petData.vaccinated_status ? petData.vaccinated_status : "N/A"}</p>
                                    </div>
                                    <div>
                                        <p><i class="fa-regular fa-calendar mr-2"></i>Birth: ${petData.date_of_birth ? petData.date_of_birth : "N/A"}</p>
                                        <p><i class="fa-solid fa-dollar-sign mr-2"></i>Price: ${petData.price ? petData.price : "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                             <h3 class="text-sm font-bold">Details Information</h3>
                             <p class="mb-5">${petData.pet_details ? petData.pet_details : "N/A"}</p>
    `;
    document.getElementById('my_modal_5').showModal();
}

loadAllPets()
loadCategories();