<?php  
/*
    Plugin Name: TEI Expert Witness Fee Calculator
    Description: Get average fee data 
    Version:     1.0.0
    Author:      Kyle Rose
    Author URI:  github.com/killa-kyle
    License:     GPL2
    License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

/*
ENQUEUE STYLES
*/
add_action('wp_enqueue_scripts', 'tei_expert_fee_calculator_enqueue_styles');
function tei_expert_fee_calculator_enqueue_styles(){
    if (is_page('expert-witness-fee-calculator')){
        
        // calculator styles 
        wp_enqueue_style( 'calculator-css',plugins_url('css/tei-expert-witness-fee-calculator.css', __FILE__), array() );

    }
}

/*
ENQUEUE SCRIPTS
*/

add_action('wp_enqueue_scripts', 'tei_expert_fee_calculator_enqueue_scripts', 5);
function tei_expert_fee_calculator_enqueue_scripts(){
    if (is_page('expert-witness-fee-calculator')){
        // Underscore
        wp_enqueue_script('Underscore', plugin_dir_url(__FILE__) . 'js/underscore-min.js', array('jquery'), '1.0.0', false );

        // Jquery CSV
         wp_enqueue_script( 'jquery-csv', plugin_dir_url(__FILE__) . 'js/jquery.csv-0.71.min.js', array('jquery','Underscore'), '1.0.0', false );
      
        // Autocomplete         
        wp_enqueue_script( 'jquery-autocomplete', plugin_dir_url(__FILE__) . 'js/jquery.autocomplete.min.js',array('jquery','Underscore','jquery-csv'), '1.0.0', false );

          // calculator script 
          wp_enqueue_script( 'calculator-script', plugin_dir_url(__FILE__) . 'tei-expert-witness-fee-calculator.js',array('jquery','Underscore','jquery-csv','jquery-autocomplete'), '1.0.0', false );
          wp_localize_script( 'calculator-script', 'feeAjax', array(
           'ajaxurl' => admin_url( 'admin-ajax.php' ),
           'ajaxnonce' => wp_create_nonce("expert_witness_fee_nonce"),
           'action' => 'get_csv',
           'ID' => get_fee_pageID()
           )); 
    }
}
/*
INIT SCRIPT
*/


// add_action('wp', 'page_load_scripts', 1);

 function get_fee_pageID(){
    global $wp_query; 
    $calculator_pageID = $wp_query->post->ID;
    return $calculator_pageID;    
};


 // Pass Fee Data to script 
add_action( 'wp_ajax_get_csv', 'get_csv');
add_action( 'wp_ajax_nopriv_get_csv', 'get_csv');
function get_csv(){    
 
    $pageID = $_REQUEST['pageID'];
    if ( !wp_verify_nonce( $_REQUEST['nonce'], "expert_witness_fee_nonce")) {
       exit("No Funny Business");
    }  
    $file_id = get_field('expert_fee_information', $pageID);
    $feeURL = $file_id["url"];
    $fees = wp_remote_retrieve_body(wp_remote_get($feeURL));
    echo $fees;
    
 wp_die();
};


















?>