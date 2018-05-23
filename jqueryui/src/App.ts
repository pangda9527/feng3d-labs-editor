// $("body").append(`<input id="autocomplete" title="type &quot;a&quot;">`);

//
feng3d.objectview.defaultBaseObjectViewClass = "OVBaseDefault";
feng3d.objectview.defaultObjectViewClass = "OVDefault";
feng3d.objectview.defaultObjectAttributeViewClass = "OAVDefault";
feng3d.objectview.defaultObjectAttributeBlockView = "OBVDefault";



$("body").ready(() =>
{
    $("body").append(`<input id="autocomplete">`);
    // $("body").append(`<input id="autocomplete">`).ready(function ()
    // {
    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
    ];

    $("#autocomplete").autocomplete({
        source: availableTags
    });
    // });


})

