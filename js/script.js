/* GLOBAL VARIABLES */
/** Get the total student in array **/
const $studentListWrapper = $('.student-list');
let $totalStudent = $studentListWrapper.children();



/******* PAGINATION ********/

/** Let you select the number of student to display per page **/
let nbreStudentPerPage = 10;

/* Calculate how many page needed 
 * I divided the total student by the number of displyed student
 * Most of the time the number of students won't match the page total
 * exemple: Here I have 54 students and the function will only displayed page
 * with 10 students, which means that the 4 last won't be displayed. So I added 1
 * to force the creation of this page.
 */
let nbrPage = Math.ceil(($totalStudent.length / nbreStudentPerPage)) + 1;


/* 
 * To get it worked I used the slice js function
 * https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/slice
 * This function create an array based on the total students array. It uses two parameters
 * A start number which represents the array index that begins the range and a end number
 * which represents the end of the range.
 */
function displayStudents($array, startRange, endRange, $wrapper){
    let sliced = $array.slice(startRange, endRange);
    for(let i = 0; i < sliced.length; i++) {
        $wrapper.append(sliced[i]);
    }
    return sliced;
}

/* Hide the full list student by JS, that means that if JS is not available on the browser
 * the list wil still be displayed
*/
$studentListWrapper.empty();

/* Displays the first 10 students
 * Slice function parameter*/
let startSliceRange = 0;
let endSliceRange = nbreStudentPerPage;
displayStudents($totalStudent, startSliceRange, endSliceRange, $studentListWrapper);

/* 1- Create the pagination container
 * 2- Add this container to the page
 * 3- Add the link to the pagination container
 * 4- Create the on click event listener to change the slice function parameter
 * and then displays the new slice array
 */
const $paginationWrapper = $('<div class="pagination"><ul></ul></div>');

$('.page').append($paginationWrapper);
for(let i = 1; i < nbrPage; i++){
    $('.pagination ul').append('<li><a href="#">'+ i +'</a></li>');
}

$('.pagination').on('click', 'a', function(e){
    e.preventDefault();
    $studentListWrapper.empty();
    
    /* Retreive the page number from the button clicked text
     * and parse it to integer */
    let pageNumber = parseInt($(this).text());
    
    /* Start: Uses the page number  minus 1, because an array index starts at 0
     * Then multiplies it by the total student per page 
     * End: Just multiplies the page number with the total student per page
     */
    startSliceRange = (pageNumber - 1) * nbreStudentPerPage;
    endSliceRange = pageNumber * nbreStudentPerPage;
    displayStudents($totalStudent, startSliceRange, endSliceRange, $studentListWrapper);
});

/** EXTRAS **/
/** SEARCH BOX FILTER **/

// Create the searchBox container
let $studentSearchForm = '<div class="student-search">';
// Create a varaible student to be use in the search/filter function
let student;
/* 
 * Search by part or full name:
 *** To be able to search by part or full name, I used RegEx
 *** I instantiate a new object with the input value as parameter
 *** And use the search() function on the student name and email
 *
 * Dealing with multiple students found:
 ** I created an array 'studentFound' to store the students
 ** and then use it at the and of the loop to display the results.
 *
 * Else: 
 * Hide the pagination, to avoid the link if there's no record.
 * Display a message 'no record' with the value typed.
 *
 * If input value is empty, load the first 10 students
 *
 *
 */
function findStudent(array, value){
    var reg = new RegExp(value.toLowerCase());  
    var studentFound = [];
    if(value != ""){
        for(let i = 0; i < array.length; i++){
            student = array[i];
            if (student.email.search(reg) == -1 && student.name.search(reg) == -1 ){
                $paginationWrapper.hide();
                $studentListWrapper.html('<div class="notFound">No student found with "'+ value +'" as name  or email</div>');
            } else {
                studentFound.push(student);
            }
        }
        $.each(studentFound, function(index, student){
            $('.notFound').hide();
                $studentListWrapper.append('<li class="student-item cf"><div class="student-details"><img class="avatar" src="'+ student.img +'"><h3>'+ student.name +'</h3><span class="email">'+ student.email +'</span></div><div class="joined-details"><span class="date">'+ student.date +'</span></div></li>');
        })
    } else {
        displayStudents($totalStudent, 0, 10, $studentListWrapper);
        $paginationWrapper.show();
    }
}

// Display the search filed in the dom
$studentSearchForm += '<input placeholder="Search for students..." />';
$studentSearchForm += '<button>Search</button></div>';
$('.page-header').append($studentSearchForm);

/* To work more easily with the datas I created an array of object
 * with the student datas. And then use this array in the findStudent function explained above.
 * 
 */
$('.page-header').on('click', 'button', function(e){
    let valueSearch = $('.student-search input');
    let arrayStudentObject = [];
    $.each($totalStudent, function(index, value){
        let $img = $(value).find('.avatar').attr("src");
        let $date = $(value).find('.date').text();
        let $name = $(value).find('h3').text();
        let $email = $(value).find('.email').text();
        arrayStudentObject.push({name: $name, email: $email, img: $img, date: $date});
    })
    $studentListWrapper.empty();
    
    findStudent(arrayStudentObject, valueSearch.val());
    valueSearch.val("");
});














