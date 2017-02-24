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


  // get 
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
      handleSubmit()
      }
    })
  }

  // function getCSV(){
  //   $.ajax({
  //     url: feeUrl['feeUrl'],
  //     async: true,
  //     success: function (csvd) {
  //       var items = $.csv.toObjects(csvd)
  //       var jsonobject = JSON.stringify(items)
  //       FEEDATA = jsonobject
  //       console.log('found fees:', items)
  //       console.log('found specialties:',
  //             getSpecialties(items)
  //             )
  //       var specialties = getSpecialties(items)
  //       initAutocomplete(specialties)

  //     },
  //     error: function (xhr, ajaxOptions, thrownError) {
  //       console.error(thrownError)
  //           console.log(xhr.status);
  //           console.log(thrownError);
  //         },
  //     dataType: 'text',
  //     complete: function (data) {
  //         // call a function on complete

  //     }
  //   })
  // }
function getCSV(){
  console.log('GETTTING CSV from ajax')
    

    var csvRequest = $.ajax({
      url: feeAjax.ajaxurl,
      type: 'POST',
      // dataType: 'text',
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
      FEEDATA = jsonobject
      // console.log('found fees:', items)
      // console.log('found specialties:',
      //       getSpecialties(items)
      //       )
      var specialties = getSpecialties(items)
      initAutocomplete(specialties)
      // console.log(feeAjax.fees)
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
      console.log('submitting....')
      var results = _.where(JSON.parse(FEEDATA),{'State':CALCULATOR.STATE,'Summarized Specialty Area':CALCULATOR.SPECIALTY})
      var nationalResults = _.where(JSON.parse(FEEDATA),{'State':"US",'Summarized Specialty Area': CALCULATOR.SPECIALTY})
        console.log('found :',results[0])
      if (results.length){
        // Update Fee Numbers
        $('#result-chart-review-fee').html(results[0]["Fee Chart Review"])
        $('#result-court-fee').html(results[0]["Fee Court"])
        $('#result-deposition-fee').html(results[0]["Fee Deposition"])


        $('#fee-result-header').html( CALCULATOR.SPECIALTY + ' Expert Witness Average Fees for ' + CALCULATOR.STATE )
      } else if(nationalResults.length){
      
        // Update Fee Numbers
        $('#result-chart-review-fee .counter').html(nationalResults[0]["Fee Chart Review"])
        $('#result-court-fee .counter').html(nationalResults[0]["Fee Court"])
        $('#result-deposition-fee .counter').html(nationalResults[0]["Fee Deposition"])
        
        $('#fee-result-header').html("National Avg. Fees for  " +CALCULATOR.SPECIALTY + " Expert Witnesses")

        // handle counter 
        $('.counter').countTo({
                  from: 50,
                  to: 2500,
                  speed: 1000,
                  refreshInterval: 50,
                  onComplete: function(value) {
                      console.debug(this);
                  }
              });
      
      } else {
        $('#fee-result-header').html('Sorry, We couldn\'t find any fee information for "'+CALCULATOR.SPECIALTY +'"')
      }

    }
    

  })
