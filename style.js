let userData = []
let empData = []
let currentpage = 1;
let pagevalue = parseInt(document.getElementById("pagenumber").value);
let paginationlist = document.getElementById("paginationbtnlist");
let add_btn= document.getElementById("btn-filled");
let add_emp= document.getElementById("addEmployeeForm");
let overlay=document.getElementById("overlay");




async function showemp(){
  if(add_emp.style.display="none" ){
    add_emp.style.display="block"
}
if(overlay.style.display="none" ){
    overlay.style.display="block"
}
}

async function closeemployeepopup(){
    if(add_emp.style.display="block" ){
        add_emp.style.display="none"
    }
    if(overlay.style.display="block" ){
        overlay.style.display="none"
    }
}
overlay.addEventListener("click", ()=>{
    closeemployeepopup()
    if(overlay.style.display="block" ){
        overlay.style.display="none"
    }
})


// ------------------edit emp
let edd_emp= document.getElementById("Employeeedit2");
let overlay1=document.getElementById("overlay");

async function showedit_emp(){
  if(edd_emp.style.display="none" ){
    edd_emp.style.display="block"
}
if(overlay.style.display="none" ){
    overlay.style.display="block"
}
}

async function closeeditemployeepopup(){
    if(edd_emp.style.display="block" ){
        edd_emp.style.display="none"
    }
    if(overlay.style.display="block" ){
        overlay.style.display="none"
    }
}
overlay.addEventListener("click", ()=>{
  closeeditemployeepopup()
    if(overlay.style.display="block" ){
        overlay.style.display="none"
    }
})


//-------------api fetching-----------
async function fetchdata() {
  try {
    const response = await fetch("http://localhost:3000/employees")
    if (!response.ok) {

      throw new Error("a error in data fetching")
    }
    const data = await response.json()
    userData = data.reverse();
    empData = userData
    console.log(userData);

    showData(currentpage)
    pagination();

  }

  catch (error) {
    console.error("network error")
  }


}
fetchdata();

document.getElementById("pagenumber").addEventListener('change', (e) => {
  e.preventDefault();
  pagevalue = parseInt(document.getElementById("pagenumber").value);

  showData(currentpage = 1);
  pagination();
})


// SHOWING DATA IN TABLE

function showData(page) {
  let start = (page - 1) * pagevalue;
  let end = start + pagevalue;
  let finalresult = userData.slice(start, end)
  i = start;
  const tablebody = document.getElementById('empbody');
  let row = "";
  finalresult.forEach((employee) => {
    i++;
    // totalitems++
    let siNo = i > 9 ? `#${i}` : `#0${i}`
    row += `
<tr>
<td>${siNo}</td>
<td class="nowrap"><img class="uploadimage" src="http://localhost:3000/employees/${employee.id}/avatar">${employee.salutation}. ${employee.firstName}  ${employee.lastName}</td>
<td>${employee.email}</td>
<td>${employee.phone}</td>
<td>${employee.gender}</td>
<td>${employee.dob}</td>
<td>${employee.country}</td>
<td>
    <div class="dropdown">
        <button class="btn-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i>
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="sample.html?id=${employee.id}"><i class="fa-solid fa-eye"></i><span>View Details</span></a></li>
          <li><a class="dropdown-item" href="#" onclick ="editemployee('${employee.id}')"><i class="fa-solid fa-pen"></i><span >Edit</span></a></li>
          <li><a class="dropdown-item" href="#" onclick = "employeedelete('${employee.id}')"><i class="fa-solid fa-trash" ></i><span>Delete</span></a></li>
        </ul>
      </div>
</td>
</tr>
`



  })

  tablebody.innerHTML = row;
  document.getElementById("employee-total").textContent = userData.length;
}

//************************* */ UPLOAD IMAGE*******************************//

let profilepic = document.getElementById("img");
let inputfile = document.getElementById("upldimg");

inputfile.onchange = () => {
  profilepic.src = URL.createObjectURL(inputfile.files[0]);
};

  //............................add employee.....................

  async function addEmployee() {
    const salutation = document.getElementById("salutation").value;
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const email = document.getElementById("mail").value;
    const phoneNumber = document.getElementById("number").value;
    const dob = document.getElementById("dob").value;
    const male = document.getElementById("male").checked;
    const female = document.getElementById("female").checked;
    const username = document.getElementById("usrnm").value;
    const password = document.getElementById("psd").value;
    const qualification = document.getElementById("qualification").value;
    const address = document.getElementById("address").value;
    const country = document.getElementById("country").value;
    const state = document.getElementById("state").value;
    const city = document.getElementById("city").value;
    const pin = document.getElementById("pin").value;
  
    let newUser = {
      salutation: salutation,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phoneNumber,
      dob: dob.split("-").reverse().join("-"),
      gender: male ? "male" : (female ? "female" : "unknown"),
      username: username,
      password: password, // Fixed the typo here
      qualifications: qualification,
      address: address,
      country: country,
      state: state,
      city: city,
      pin: pin
    };
     
    try {
      const response = await fetch("http://localhost:3000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data)
      
      
      imgfetch(data.id)
       
      newUser.id = data.id
      userData.unshift(newUser);
      showData(currentpage);
      closeemployeepopup();
      document.getElementById("forms").reset();
      Swal.fire({
        title: "Employee Added Succesfully",
        text: "You clicked the button!",
        icon: "success"
      });

  
  
      console.log('Employee added successfully');
   } catch (error) {
      console.error("Error in add employee:", error);
  
    }
  }
  
  document.getElementById("addemployee").addEventListener('click', (e) => {
    e.preventDefault();
    console.log("clicked")
  
    addvalidation()
    addEmployee();
    
  });

   //------------image fetching-------------
  
   async function imgfetch(id) {
    console.log(id);
    
    const inputfile = document.getElementById("upldimg");
    if (inputfile.files.length > 0) {
      const formdata = new FormData();
      formdata.append("avatar", inputfile.files[0]);

      const avatarresponse = await fetch(`http://localhost:3000/employees/${id}/avatar`, {
        method: "POST",
        body: formdata,
      
      });
      const image= await avatarresponse.json()
      console.log(image)

  }}
  
   
 
  // ********************************EDITING UPLOAD IMAGE*************************************//

let editpic = document.getElementById("editEmployeeChangeImage2");
let editupload = document.getElementById("editupload2");

editupload.onchange = () => {
  editpic.src = URL.createObjectURL(editupload.files[0])

}


// //-----------------------------employee edit-----------------------------



async function editemployee(id) {
  showedit_emp();

  try {
    const response = await fetch(`http://localhost:3000/employees/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch employee data for editing");
    }
    const userData = await response.json();

    console.log(userData);
    

    // Populate form fields with userData
    
    document.getElementById("empIdInp").value = userData.id;
    document.getElementById("editEmployeeChangeImage2").src = `http://localhost:3000/employees/${id}/avatar`;
    document.getElementById("editSalutation2").value = userData.salutation;
    document.getElementById("editFirstName2").value = userData.firstName;
    document.getElementById('editLastName2').value = userData.lastName;
   document.getElementById('editEmail2').value = userData.email;
   document.getElementById('editMobileNumber2').value = userData.phone;
   document.getElementById('editDateOfBirth2').value = userData.dob.split("-").reverse().join("-");
   document.getElementById('editmale2').checked = userData.gender==="male";
   document.getElementById('editFemale2').checked = userData.gender==="female";
   document.getElementById('editusrnm2').value = userData.username;
   document.getElementById('editpsd2').value = userData.password;
   document.getElementById('editQualification2').value = userData.qualifications;
   document.getElementById('editAddress2').value = userData.address;
   document.getElementById('editCountry2').value = userData.country;
   document.getElementById('editState2').value = userData.state;
   document.getElementById('editCity2').value = userData.city;
   document.getElementById('editPin2').value = userData.pin;
    

    
  } catch (error) {
    console.error("Error editing employee:", error);
    Swal.fire("Error", "Failed to fetch employee data. Please try again.", "error");
  }
  
}


async function EditUser() {
  console.log("clicked");

  try {
    const id = document.getElementById("empIdInp").value;
    const salutation = document.getElementById("editSalutation2").value;
    const firstName = document.getElementById("editFirstName2").value;
    const lastName = document.getElementById("editLastName2").value;
    const email = document.getElementById("editEmail2").value;
    const phoneNumber = document.getElementById("editMobileNumber2").value;
    const dob = document.getElementById("editDateOfBirth2").value;
    const male = document.getElementById("editmale2").checked;
    const female = document.getElementById("editFemale2").checked;
    const username = document.getElementById("editusrnm2").value;
    const password = document.getElementById("editpsd2").value;
    const qualification = document.getElementById("editQualification2").value;
    const address = document.getElementById("editAddress2").value;
    const country = document.getElementById("editCountry2").value;
    const state = document.getElementById("editState2").value;
    const city = document.getElementById("editCity2").value;
    const pin = document.getElementById("editPin2").value;

    // Creating the update object
    const updateuser = {
      id,
      salutation,
      firstName,
      lastName,
      email,
      phone: phoneNumber,
      qualifications: qualification,
      address,
      city,
      state,
      country,
      dob: dob.split("-").reverse().join("-"),
      gender: male ? "male" : (female ? "female" : "unknown"),
      username,
      password,
      pin,
    };

    // Sending the user update request
    const response = await fetch(`http://localhost:3000/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateuser),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Pass the ID to the avatar upload function
     edimgfetch(id);

    // Refresh data and reset form
    showData(currentpage);
    closeemployeepopup();
    document.getElementById("forms").reset();

    console.log("Employee updated successfully");
  } catch (error) {
    console.error("Error in update employee:", error.message, error);
  }
}

async function edimgfetch(id) {
  console.log(id)
  // Handling avatar upload if a file is selected
  const editinput = document.getElementById("editupload2");
  if (editinput.files.length > 0) {
    const formdata = new FormData();
    formdata.append("avatar", editinput.files[0]);

    const avatarresponse = await fetch(`http://localhost:3000/employees/${id}/avatar`, {
      method: "POST",
      body: formdata,
    });

    if (!avatarresponse.ok) {
      throw new Error(`Failed to upload avatar. Status: ${avatarresponse.status}`);
    }

    const image = await avatarresponse.json();
    console.log("Avatar uploaded successfully:", image);
  }
}



function submitEditUser(){
  EditUser()
  editvalidation();
  
}
       

  
// -----------------------------EMPLOYEE DELETE---------------------------------//


  async function employeedelete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleted = await fetch(`http://localhost:3000/employees/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
  
        if (!deleted.ok) {
          throw new Error('Failed to delete employee');
        }
  
      
        userData = userData.filter(emp => emp.id !== id);
        showData(userData);
  
    
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        
        console.log(userData);
      }
    });
  }
  



//------------------validation---------------------

function addvalidation() {

  const salutation = document.getElementById("salutation").value.trim();
  const firstName = document.getElementById("firstname").value.trim();
  const lastName = document.getElementById("lastname").value.trim();
  const email = document.getElementById("mail").value.trim();
  const phone = document.getElementById("number").value.trim();

  // DOB

  const DOB = document.getElementById("dob");
  const dob_validtaion = document.getElementById("boberror");
  const dob_value = DOB.value.trim();

  // GENDER 

  const gender = document.querySelector('input[name="gender"]:checked')
  const gender_validation = document.getElementById("gendererror");
  
  const username = document.getElementById("usrnm").value.trim();
  const password = document.getElementById("psd").value.trim();
  const qualifications = document.getElementById("qualification").value.trim();
  const address = document.getElementById("address").value.trim();
  const country = document.getElementById("country").value.trim();
  const state = document.getElementById("state").value.trim();
  const city = document.getElementById("city").value.trim();
  const pin = document.getElementById("pin").value.trim();

  // PATTERNS
  const namepattern = /^[A-za-z]+$/
  const phonePattern = /^\d{10}$/
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const pinpattern = /^\d{6}$/
  let Valid = true;

  // validation of gender and DOB

  if (gender) {
    gender_validation.textContent = ""
  }
  else {
    gender_validation.textContent = " * gender is required"
    Valid = false;
  }

  if (dob_value === "") {
    dob_validtaion.textContent = " * Date of Birth is required"
    Valid = false;
  }

  // Valiadation of form 

  if (salutation == "" || salutation == "select") {
    document.getElementById("salutationerror").textContent = " * salutation is required";
    Valid = false;
  }

  if (!namepattern.test(firstName)) {
    document.getElementById("firstnameerror").textContent = " * first name is required"
    Valid = false;
  }

  if (!namepattern.test(lastName)) {
    document.getElementById("lastnameerror").textContent = " * last name is required"
    Valid = false;
  }

  if (!emailPattern.test(email)) {
    document.getElementById("mailerror").textContent = " * email is required"
    Valid = false;
  }

  if (!phonePattern.test(phone)) {
    document.getElementById("numbererror").textContent = " * number is required"
    Valid = false;
  }

  if (username == "") {
    document.getElementById("usernameerror").textContent = " * username is required"
    Valid = false;
  }

  if (password == "") {
    document.getElementById('passworderror').textContent = " * Password is required"
    Valid = false;
  }

  if (qualifications == "") {
    document.getElementById('qualificationerror').textContent = " * Qualification is required"
    Valid = false;
  }

  if (address == "") {
    document.getElementById('addresserror').textContent = " * Address is required"
    Valid = false;
  }


  if (country == "" || country == "select country") {
    document.getElementById('countryerror').textContent = " * Country is required"
    Valid = false;
  }

  if (state == "" || state == "select state") {
    document.getElementById('stateerror').textContent = " * State is required"
    Valid = false;
  }

  if (city == "") {
    document.getElementById('cityerror').textContent = " * City is required"
    Valid = false;
  }

  if (!pinpattern.test(pin)) {
    document.getElementById('pinerror').textContent = " * pin is required"
    Valid = false;
  }


  // validation of gender when clicking

  const male = document.getElementById("male");
  const female = document.getElementById("female");
  male.addEventListener("click", () => {
    document.getElementById("gendererror").textContent = "";
  })
  female.addEventListener("click", () => {

    document.getElementById("gendererror").textContent = "";
  })
  document.getElementById("forms").addEventListener("submit", (event) => {
    event.preventDefault();
  })
  return Valid;

}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("addEmployeeForm").addEventListener("input", (event) => {
    const input = event.target;
    const errormsg = input.parentElement.querySelector(".errormsg");
    if (input && errormsg) {
      errormsg.textContent = "";
    }

  })
  document.getElementById("forms").addEventListener("submit", (event) => {
    event.preventDefault();

  })
})




//------------------edit validation--------------------------



function editvalidation() {

  const salutation = document.getElementById("editSalutation2").value.trim();
  const firstName = document.getElementById("editFirstName2").value.trim();
  const lastName = document.getElementById("editLastName2").value.trim();
  const email = document.getElementById("editEmail2").value.trim();
  const phone = document.getElementById("editMobileNumber2").value.trim();

  // DOB

  const DOB = document.getElementById("editDateOfBirth2");
  const dob_validtaion = document.getElementById("dobedit2");
  const dob_value = DOB.value.trim();

  // GENDER 

  const gender = document.querySelector('input[name="gender"]:checked')
  const gender_validation = document.getElementById("genderedit");

  const username = document.getElementById("editusrnm2").value.trim();
  const password = document.getElementById("editpsd2").value.trim();
  const qualifications = document.getElementById("editQualification2").value.trim();
  const address = document.getElementById("editAddress2").value.trim();
  const country = document.getElementById("editCountry2").value.trim();
  const state = document.getElementById("editState2").value.trim();
  const city = document.getElementById("editCity2").value.trim();
  const pin = document.getElementById("editPin2").value.trim();

  // PATTERNS
  const namepattern = /^[A-za-z]+$/
  const phonePattern = /^\d{10}$/
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const pinpattern = /^\d{6}$/
  let Valid = true;

  // validation of gender and DOB

  if (gender) {
   
    gender_validation.textContent = ""
  }
  else {
    gender_validation.textContent = " * gender is required"
    Valid = false;
  }

  if (dob_value === "") {
    dob_validtaion.textContent = " * Date of Birth is required"
    Valid = false;
  }

  // Valiadation of form 

  if (salutation == "" || salutation == "select") {
    document.getElementById("salutationedit").textContent = " * salutation is required";
    Valid = false;
  }

  if (!namepattern.test(firstName)) {
    document.getElementById("firstnameedit").textContent = " * first name is required"
    Valid = false;
  }

  if (!namepattern.test(lastName)) {
    document.getElementById("lastnameeditedit").textContent = " * last name is required"
    Valid = false;
  }

  if (!emailPattern.test(email)) {
    document.getElementById("mailedit").textContent = " * email is required"
    Valid = false;
  }

  if (!phonePattern.test(phone)) {
    document.getElementById("numberedit").textContent = " * number is required"
    Valid = false;
  }

  if (username == "") {
    document.getElementById("usernameedit").textContent = " * username is required"
    Valid = false;
  }

  if (password == "") {
    document.getElementById('passwordedit').textContent = " * Password is required"
    Valid = false;
  }

  if (qualifications == "") {
    document.getElementById('qualificationedit').textContent = " * Qualification is required"
    Valid = false;
  }

  if (address == "") {
    document.getElementById('addressedit').textContent = " * Address is required"
    Valid = false;
  }


  if (country == "" || country == "select country") {
    document.getElementById('countryedit').textContent = " * Country is required"
    Valid = false;
  }

  if (state == "" || state == "select state") {
    document.getElementById('stateedit').textContent = " * State is required"
    Valid = false;
  }

  if (city == "") {
    document.getElementById('cityedit').textContent = " * City is required"
    Valid = false;
  }

  if (!pinpattern.test(pin)) {
    document.getElementById('pinedit').textContent = " * pin is required"
    Valid = false;
  }


  // validation of gender when clicking

  const male = document.getElementById("editmale2");
  const female = document.getElementById("editFemale2");
  male.addEventListener("click", () => {
    document.getElementById("genderedit").textContent = "";
  })
  female.addEventListener("click", () => {

    document.getElementById("genderedit").textContent = "";
  })
  document.getElementById("formedit2").addEventListener("submit", (event) => {
    event.preventDefault();
  })
  return Valid;

}



//**************************SEARCH INPUT***************************//

const searchinput = document.getElementById("searchinput");

searchinput.addEventListener('input', (event) => {
  const searchvalue = event.target.value.trim().toLowerCase();

  userData = empData;

  if (searchvalue !== "") {
    userData = userData.filter((employee) => {
      return (
        employee.firstName.toLowerCase().includes(searchvalue) ||
        employee.lastName.toLowerCase().includes(searchvalue) ||
        employee.email.toLowerCase().includes(searchvalue) ||
        employee.phone.toLowerCase().includes(searchvalue)
      );
    });
  }
  showData(currentpage)
  pagination()
});



//**************************************/ PAGINATION /************************ */

function pagination(){


paginationlist.innerHTML = ""
let totalpages = Math.ceil(userData.length / pagevalue)

let fastBtn = document.createElement("li");
    fastBtn.classList.add("pagebtn");
    fastBtn.innerHTML = `<a class="page-link"><<1st Page</a>`
    paginationlist.appendChild(fastBtn);
    fastBtn.addEventListener("click",()=>{
      showData(currentpage = 1)
      highlightcurrentpage()
    })

    let firstprevious = document.createElement("li");
        firstprevious.classList.add("pagebtn");
        firstprevious.innerHTML =`<a class="page-link"><</a>`
        paginationlist.appendChild(firstprevious);
        firstprevious.addEventListener("click",()=>{
          if(currentpage!=1){
             currentpage--
          }
          else{
currentpage=1
          }
          showData(currentpage)
          highlightCurrentPage()
        }
        )



        for(let i=1; i<=totalpages; i++){
let page = document.createElement("li");
    page.classList.add("pagebtn");
    page.innerHTML =`<a class="page-link">${i}</a>`
    if (i === currentpage) {
      page.classList.add("active");
  }
    paginationlist.appendChild(page);
    page.addEventListener("click", ()=>{

      showData(currentpage=i);
      highlightCurrentPage()
    })
        }


        let nextbtn = document.createElement("li");
        nextbtn.classList.add("pagebtn");
        nextbtn.innerHTML = `<a class="page-link">></a>`
        paginationlist.appendChild(nextbtn);
        nextbtn.addEventListener("click",()=>{
if(currentpage!=totalpages){
currentpage++
}
else{
currentpage=totalpages;


}

showData(currentpage);
highlightCurrentPage()



        })


        let lastbtn = document.createElement("li");
        lastbtn.classList.add("pagebtn");
        lastbtn.innerHTML=`<a class="page-link">last Page>></a>`
        paginationlist.appendChild(lastbtn)
        lastbtn.addEventListener("click", ()=>{
          showData(currentpage=totalpages)
          highlightCurrentPage()
        })

}

function highlightCurrentPage() {
  const pageBtns = document.querySelectorAll(".pagebtn");
  pageBtns.forEach(btn => {
      btn.classList.remove("active");
  });
  pageBtns.forEach(btn => {
      if (btn.innerText.trim() == currentpage) {
          btn.classList.add("active");
      }
  });
}
