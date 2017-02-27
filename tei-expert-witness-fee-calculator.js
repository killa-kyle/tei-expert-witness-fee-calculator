jQuery(document).ready(function ($) {
  var FEEDATA = [];
  // form state 
  var CALCULATOR = {
    SPECIALTY: "",
    STATE: "AL"
  };

  // start script
  init()
  function init(){
    getCSV();
    handleStateInput();
  }

  //handle update state and rerender
  function setState(newValue) {
    var NEWSTATE = $.extend({}, CALCULATOR, newValue)
    console.log('State updated:', NEWSTATE)
    CALCULATOR = NEWSTATE
    // render(CALCULATOR)
  }

  // RENDER  STATE
  function render(state) {
    console.log('rendering.....')

    // clear USER KPI column
    $('#results').html('');
    //refetch columns
    $('#results').append('<h3>Looking for  '+CALCULATOR.SPECIALTY+' Expert Witness Fees in '+CALCULATOR.STATE+'</h3>')
  }

  // handle state input change 
  function handleStateInput(){
    $('#state-input').change(function(e){
      var selectedState = $(this).find('option:selected').val();
      setState({
        STATE: selectedState
      })
        handleSubmit()
    })
  }


  // get specialties from fee data 
  function getSpecialties (fee_data) {
    var myResult = _.where(fee_data, {'State': 'US'})
    var SpecialtyList = []
    $.each(myResult, function (index, val) {             
      SpecialtyList.push({'value': val['Summarized Specialty Area']})
    })

    return SpecialtyList
  }

  function initAutocomplete (SpecialtyList) {
    console.log('autocomplete', SpecialtyList)
    $('#specialty-input').autocomplete({
      lookup: SpecialtyList,
      onSelect: function (suggestion) {
        console.log('You selected: ' + suggestion.value)
        // update state with current suggestion
        setState({
          SPECIALTY: suggestion.value
        })
      // handleSubmit()
      }
    })
  }

// get fee data from post object 
function getCSV(){
  console.log('GETTTING CSV from ajax')
    

    var csvRequest = $.ajax({
      url: feeAjax.ajaxurl,
      type: 'POST',
      data: {  
        action: feeAjax.action,    
        nonce: feeAjax.ajaxnonce,
        pageID: feeAjax.ID
      }}
    );
    csvRequest
    .then(function(data){
      console.log('FOUND FEE DATA')
      var items = $.csv.toObjects(data)
      var jsonobject = JSON.stringify(items)
      FEEDATA = jsonobject //update global fee data 
      
      var specialties = getSpecialties(items) // get unique specialties for autocomplete
      initAutocomplete(specialties) // init autocomplete
    })
}

    //handle form submit 
    $('#expert-fee-calulator-form').on('submit',function(e){
      e.preventDefault()
      setState({
        SPECIALTY: $('#specialty-input').val().trim()
      })
      handleSubmit(e)
    });

    function handleSubmit(){
      // cache fee element
      var CHART_FEE = $('#result-chart-review-fee .counter')
      var COURT_FEE = $('#result-court-fee .counter')
      var DEPOSITION_FEE = $('#result-deposition-fee .counter')
      var FEE_HEADER = $('#fee-result-header')

      var results = _.where(JSON.parse(FEEDATA),{'State':CALCULATOR.STATE,'Summarized Specialty Area':CALCULATOR.SPECIALTY})
      var nationalResults = _.where(JSON.parse(FEEDATA),{'State':"US",'Summarized Specialty Area': CALCULATOR.SPECIALTY})
        console.log('found :',results[0])

      // if query found  
      if (results.length){
        // Update Fee Numbers
        CHART_FEE.html(results[0]["Fee Chart Review"])
        COURT_FEE.html(results[0]["Fee Court"])
        DEPOSITION_FEE.html(results[0]["Fee Deposition"])

        CHART_FEE.countTo({
                  from: 50,
                  to:CHART_FEE.html(),
                  speed: 1000,
                  refreshInterval: 50
              });

        COURT_FEE.countTo({
                  from: 0,
                  to:COURT_FEE.html(),
                  speed: 1000,
                  refreshInterval: 50
              });

        DEPOSITION_FEE.countTo({
                  from: 0,
                  to:DEPOSITION_FEE.html(),
                  speed: 1000,
                  refreshInterval: 50
              });


        // update header 
        FEE_HEADER.html( CALCULATOR.SPECIALTY + ' Expert Witness Average Fees for ' + CALCULATOR.STATE )

      } else if(nationalResults.length){ // if no state level results show national
      
        // Update Fee Numbers
        CHART_FEE.html(nationalResults[0]["Fee Chart Review"])
        COURT_FEE.html(nationalResults[0]["Fee Court"])
        DEPOSITION_FEE.html(nationalResults[0]["Fee Deposition"])

        CHART_FEE.countTo({
                  from: 50,
                  to:CHART_FEE.html(),
                  speed: 1000,
                  refreshInterval: 50
              });

        COURT_FEE.countTo({
                  from: 0,
                  to:COURT_FEE.html(),
                  speed: 1000,
                  refreshInterval: 50
              });

        DEPOSITION_FEE.countTo({
                  from: 0,
                  to:DEPOSITION_FEE.html(),
                  speed: 1000,
                  refreshInterval: 50
              });

        
        // update header 
        FEE_HEADER.html("National Average Fees for  " +CALCULATOR.SPECIALTY + " Expert Witnesses")


      
      } else {
        FEE_HEADER.html('Sorry, We couldn\'t find any fee information for "'+CALCULATOR.SPECIALTY +'"')
        // Update Fee Numbers
        CHART_FEE.html('-')
        COURT_FEE.html('-')
        DEPOSITION_FEE.html('-')
      }


    }
    

  })
