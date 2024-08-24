var initial = "print 'Hello'\n" +
                      "print 'Parsons\n" +
                      "print 'problems!";

function displayErrors(fb) {
    if(fb.errors.length > 0) {
        alert(fb.errors[0]);
    }
} 

document.addEventListener('DOMContentLoaded', () => {   //make sure script is loaded
    console.log("DOM fully loaded and parsed");
    var parson = new ParsonsWidget({
        sortableId: 'sortable',
        trashId: 'sortableTrash',
        max_wrong_lines: 1,
        feedback_cb : displayErrors,
        can_indent: false
    });
    parson.init(initial);
    parson.shuffleLines();

    document.getElementById('submit-btn').addEventListener('click', () => {
        var result = parson.getFeedback();
        alert(result.feedback); // Display feedback to the user
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        parson.shuffleLines(); // Reshuffle the blocks for a new attempt
    });


});
