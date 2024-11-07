 //..........delete popup............
 let delbtn=document.getElementById("viewdelete");
 let delpopup=document.getElementById("#deleteemployee")
    delbtn.addEventListener("click",(e)=>{
      employeedelete(id)
        // Swal.fire({
        //     title: "Are you sure?",
        //     text: "You won't be able to revert this!",
        //     icon: "warning",
        //     showCancelButton: true,
        //     confirmButtonColor: "#3085d6",
        //     cancelButtonColor: "#d33",
        //     confirmButtonText: "Yes, delete it!"
        //   }).then((result) => {
        //     if (result.isConfirmed) {
              
        //       Swal.fire({
        //         title: "Deleted!",
        //         text: "Your file has been deleted.",
        //         icon: "success"
        //       });
        //     }
        //   });
      
     })




 let add_emp= document.getElementById("editEmployee");
let overlay=document.getElementById("overlay");

let userData;
function show_emp(){
  if(add_emp.style.display="none" ){
    add_emp.style.display="block"
}
if(overlay.style.display="none" ){
    overlay.style.display="block"
}
}

function closeemployeepopup(){
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

const url = new URL(window.location.href);
  const id = url.searchParams.get('id');
  console.log(id);
''

//   ****************FETCHING DATA FROM BACKEND********************************//


let viewdata = [];
let userdata = viewdata;
const fetchemployee = async (employeeid) => {
  try {
    const response = await fetch(`http://localhost:3000/employees/${employeeid}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch employee data");
    }

    viewdata = await response.json();
    console.log(viewdata);
    viewemployee(viewdata);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};


fetchemployee(id); 



// *****************SHOW DATA DETAILS IN TABLE********************//



function viewemployee (employee){

    // to calculate age

let agedata = employee.dob
console.log(agedata);
let year = agedata.split("-").pop()
console.log(year)
let currentyear = new Date().getFullYear()
console.log(currentyear);
let currentage = currentyear-year
console.log(currentage);

    
document.getElementById("userdetailimage").src = `http://localhost:3000/employees/${employee.id}/avatar`;
    document.getElementById("viewname").innerText = `${employee.salutation}. ${employee.firstName} ${employee.lastName}`;
    document.getElementById("viewmail").innerText = `${employee.email}`;
    document.getElementById("viewgender").innerText = `${employee.gender}`;
    document.getElementById("viewage").innerText = currentage;
    document.getElementById("viewdob").innerText = `${employee.dob}`;
    document.getElementById("viewnumber").innerText = `${employee.phone}`;
    document.getElementById("viewqualification").innerText = `${employee.qualifications}`;
    document.getElementById("viewaddress").innerText = `${employee.address}`;
    document.getElementById("viewusername").innerText = `${employee.username}`;
}

// 
document.getElementById('vieweditchange').addEventListener("click", () => {
  vieweditemployee(id);
});

async function vieweditemployee(id) {
  show_emp()
  try {
    const response = await fetch(`http://localhost:3000/employees/${id}`);
    if (!response.ok) {
      throw new Error("failed to fetch employee data for editing");
    }

    const viewdata = await response.json();
// document.getElementById("editEmployeeChangeImage").src = `http://localhost:3000/employees/${id}/avatar`
    document.getElementById('editPin').value = viewdata.pin;
    document.getElementById('editSalutation').value = viewdata.salutation;
    document.getElementById('editFirstName').value = viewdata.firstName;
    document.getElementById('editLastName').value = viewdata.lastName;
    document.getElementById('editEmail').value = viewdata.email;
    document.getElementById('editMobileNumber').value = viewdata.phone;
    document.getElementById('editDateOfBirth').value = viewdata.dob.split("-").reverse().join("-");
    document.getElementById('editmale').checked = viewdata.gender === "male";
    document.getElementById('editFemale').checked = viewdata.gender === "female";
    document.getElementById('editusrnm').value = viewdata.username;
    document.getElementById('editpsd').value = viewdata.password;
    document.getElementById('editQualification').value = viewdata.qualifications;
    document.getElementById('editAddress').value = viewdata.address;
    document.getElementById('editCountry').value = viewdata.country;
    document.getElementById('editState').value = viewdata.state;
    document.getElementById('editCity').value = viewdata.city;

    const viewsubmitbtn = document.getElementById("saveEditEmployee");
    const newsbmitbtn = viewsubmitbtn.cloneNode(true);
    viewsubmitbtn.parentNode.replaceChild(newsbmitbtn, viewsubmitbtn)


    newsbmitbtn.addEventListener("click", async (e) => {
      e.preventDefault();
      viewvalidation();
      
      const updatedUser = {
        pin: document.getElementById("editPin").value,
        salutation: document.getElementById("editSalutation").value,
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        email: document.getElementById("editEmail").value,
        phone: document.getElementById("editMobileNumber").value,
        qualifications: document.getElementById("editQualification").value,
        address: document.getElementById("editAddress").value,
        city: document.getElementById("editCity").value,
        state: document.getElementById("editState").value,
        country: document.getElementById("editCountry").value,
        dob: document.getElementById("editDateOfBirth").value.split("-").reverse().join("-"),
        gender: document.getElementById("editmale").checked ? "male" : "female",
        username : document.getElementById('editusrnm').value,
        password : document.getElementById('editpsd').value
      }; 

      console.log(updatedUser)
      try {
        const putResponse = await fetch(`http://localhost:3000/employees/${id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser)
        });

        const editinput = document.getElementById("vieweditimg");
        if(editinput.files.length>0){
const formdata= new FormData();
formdata.append("avatar",editinput.files[0]);

const avatarresponse= await fetch(`http://localhost:3000/employees/${id}/avatar`,{
  method:"POST",
  body:formdata,
});


        }
        updatedUser.id = id
       
        const userindex = userdata.findIndex(employee => employee.id === id);
        userdata.splice(userindex,1,updatedUser)

      
        closevieweditpopup();
        Swal.fire({
          title: "Employee Edited Succesfully",
          text: "You clicked the button!",
          icon: "success"
        });
        
        viewemployee(updatedUser);


      } catch (error) {
        console.error('Error updating employee:', error);

        closevieweditpopup();

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch employee data for editing. Please try again later.',
        });
       
        
      }
    });

  } catch (error) {
    console.error('Error fetching employee data:', error);

    closeemployeepopup();

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to fetch employee data for editing. Please try again later.',
    });
    
  }
}



function viewvalidation(){

  const salutation = document.getElementById("editSalutation").value.trim();
  const firstName = document.getElementById("editFirstName").value.trim();
  const lastName = document.getElementById("editLastName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editMobileNumber").value.trim();
  
  // DOB
  
  const DOB = document.getElementById("editDateOfBirth");
   const dob_validtaion = document.getElementById("viewdoberror");
  const dob_value = DOB.value.trim();
  
  // GENDER 
  
  const gender = document.querySelector('input[name="editgender"]:checked')
  const gender_validation = document.getElementById("viewgendererror");
  
  const username = document.getElementById("editusrnm").value.trim();
   const password = document.getElementById("editpsd").value.trim();
  const qualifications = document.getElementById("editQualification").value.trim();
  const address = document.getElementById("editAddress").value.trim();
  const country = document.getElementById("editCountry").value.trim();
  const state = document.getElementById("editState").value.trim();
  const city = document.getElementById("editCity").value.trim();
  const pin = document.getElementById("editPin").value.trim();
  
  // PATTERNS
  const namepattern = /^[A-za-z]+$/
  const phonePattern = /^\d{10}$/
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const pinpattern = /^\d{6}$/
  let Valid = true;
  
  // validation of gender and DOB
  
  if(gender){
    gender_validation.textContent = ""
  }
  else{
    gender_validation.textContent = " * gender is required"
    Valid = false;
  }
  
  if(dob_value === ""){
    dob_validtaion.textContent = " * Date of Birth is required"
    Valid = false;
  }
  
  // Valiadation of form 
  
  if(salutation == "" || salutation == "select"){
    document.getElementById("viewsalutationerror").textContent = " * salutation is required";
    Valid = false;
  }
  
  if(!namepattern.test(firstName)){
  document.getElementById("viewfirsterror").textContent = " * first name is required"
  Valid = false;
  }
  
  if(!namepattern.test(lastName)){
  document.getElementById("viewlasterror").textContent = " * last name is required"
  Valid = false;
  }
  
  if(!emailPattern.test(email)){
    document.getElementById("viewemailerror").textContent =" * email is required"
  Valid = false;
  }
  
  if(!phonePattern.test(phone)){
    document.getElementById("viewnumbererror").textContent =" * number is required"
  Valid = false;
  }
  
  if(username == ""){
  document.getElementById("viewusernameerror").textContent = " * username is required"
  Valid = false;
  }
  
  if (password == "") {
    document.getElementById('viewpassworderror').textContent = " * Password is required"
    Valid = false;
  }
  
  if (qualifications == "") {
    document.getElementById('viewqualificationerror').textContent = " * Qualification is required"
    Valid = false;
  }
  
  if (address == "") {
    document.getElementById('viewaddresserror').textContent = " * Address is required"
    Valid = false;
  }
  
  
  if (country == "" || country == "select country") {
    document.getElementById('viewcountryerror').textContent = " * Country is required"
    Valid = false;
  }
  
  if (state == "" || state == "select state") {
    document.getElementById('viewstateerror').textContent = " * State is required"
    Valid = false;
  }
  
  if (city == "" ) {
    document.getElementById('viewcityerror').textContent = " * City is required"
    Valid = false;
  }
  
  if (!pinpattern.test(pin)) {
    document.getElementById('viewpinerror').textContent = " * pin is required"
    Valid = false;
  }
  
  
  // validation of gender when clicking
  
  const male = document.getElementById("editmale");
  const female = document.getElementById("editFemale");
  male.addEventListener("click", ()=>{
    document.getElementById("viewgendererror").textContent = "";
  })
  female.addEventListener("click", ()=>{
  
  document.getElementById("viewgendererror").textContent = "";
  })
  document.getElementById("viewforms").addEventListener("submit", (event)=>{
  event.preventDefault();
  })
  return Valid;
  
  }
  
  document.addEventListener("DOMContentLoaded",function (){
    document.getElementById("editEmployee").addEventListener("input",(event)=>{
  const input = event.target;
  const errormsg = input.parentElement.querySelector(".errormsg");
  if(input && errormsg ){
  errormsg.textContent = "";
  }
  
    })
    document.getElementById("viewforms").addEventListener("submit",(event)=>{
  event.preventDefault();
  
    })
  })



  //-----------------employe delete--------------

  async function employeedelete(id) {
    // Display the confirmation dialog first
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
        // Proceed with deletion if confirmed
        const deleted = await fetch(`http://localhost:3000/employees/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
        
        if (!deleted.ok) {
          throw new Error('Failed to delete employee');
        }
  
        // Update the userData after deletion
        userData = userData.filter(emp => emp.id !== id);
  
        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
  
        // Update the display
        showData(userData);
      }
    });
  }
  