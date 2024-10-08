<?php

$request_headers = getallheaders();
if($_SERVER['REQUEST_METHOD'] !=="POST"){
   http_response_code(502);
   die;
}

if( !in_array($request_headers['Host'],array_merge($allowedUrls, ["192.168.33.11","be29-102-89-2-17.ngrok.io","192.168.33.99","digimart.org.ng","digimart.justinches.net","Mckodev.attendout.com", "digimart.feezy"])) ){
  http_response_code(502);
  die;
}
// if (!isset($_SESSION['id'])) {
//   $response['error'] = "An error occured, please try to login again";
//   // die;
// }else{


  $json = file_get_contents("php://input");
  // var_dump($json);
  $data = json_decode($json, true);
  
  // die(print_r($data));


  // $orgId = $data['orgId'];

  $response = [];



  try {
    // $userId = $_SESSION['id'];

    $checkBizUrl = $conn->prepare("SELECT * FROM read_businesses WHERE booking_url = :bookingUrl");
    $checkBizUrl->execute(["bookingUrl"=>$data['bookingUrl']]);

    if (!($checkBizUrl->rowCount() > 0)) {
          $response['error'] = "An error occured ask, the business to give a valid URL";
    }else{
      $bizData = $checkBizUrl->fetch(PDO::FETCH_BOTH);
      $bizId = $bizData['id'];

      if (!isset($data['client_id'])) {
          $data['client_id'] = NULL;
      }
      // die(print_r($bizData));

      $hash_id = rand(0,99999).time();
       // var_dump($data);
      $insertStmt = $conn->prepare("INSERT INTO `read_booking_data`( `hash_id`, `input_contact_id`,`input_business_id`, `input_booking_date`, `input_booking_time`, `input_email`, `input_phone_number`, `input_name`, `visibility`, `date_created`, `time_created`) VALUES (:hash_id, :client_id,:bizId, :bookingDate, :bookingTime, :email, :phone_no, :name, 'show', NOW(), NOW() )");

      $dataArr = [
      "hash_id"=>$hash_id,
      "bizId"=>$bizId,
      "bookingDate"=>$data['bookingDate'],
      "bookingTime"=>$data['bookingTime'],
      "client_id"=>$data['client_id'],
      "email"=>$data['email'],
      "phone_no"=>$data['phone_no'],
      "name"=>$data['name'],
      ];


      if ($insertStmt->execute($dataArr)) {
        $response['success'] = "You've successfully booked ".$bizData['input_business_name'];

      }

    }

     
  } catch (\Exception $e) {
    echo $e->getMessage();

    $response['error'] = "An error occured";

  }
// }





$response = json_encode($response);
echo $response;
