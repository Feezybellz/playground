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
if (!isset($_SESSION['id'])) {
  $response['error'] = "An error occured, please try to login again";
  // die;
}else{


  $json = file_get_contents("php://input");
  // var_dump($json);
  $data = json_decode($json, true);

  $data['bizId'] = base64_decode($data['bizId']);

  $serializeSettings = serialize($data['scheduleData']);

  // $orgId = $data['orgId'];

  $response = [];



  try {
    $userId = $_SESSION['id'];

    $checkUrlExist = $conn->prepare("SELECT * FROM read_businesses WHERE booking_url = :bookingUrl AND NOT id = :bizId ");
    $checkUrlExist->execute(["bookingUrl"=>$data['bookingUrl'], 
    //"user_id"=>$userId, 
      "bizId"=>$data['bizId'],]);
    // die(var_dump($checkUrlExist->fetchAll(),$checkUrlExist->rowCount() > 0 ));
    if ($checkUrlExist->rowCount() > 0) {
          $response['error'] = "URL exist kindly input a new url";

    }else{

      // var_dump($data);
      $updateStmt = $conn->prepare("UPDATE read_businesses SET booking_setting = :bookingSetting, booking_url = :bookingUrl WHERE id = :bizId AND user_id = :user_id");

      $dataArr = [
      "bizId"=>$data['bizId'],
      "bookingUrl"=>$data['bookingUrl'],
      "user_id"=>$userId,
      "bookingSetting"=>$serializeSettings,
      ];


      if ($updateStmt->execute($dataArr)) {
        $response['success'] = "Booking Setting Saved";

      }
    }


  } catch (\Exception $e) {
    echo $e->getMessage();

    $response['error'] = "An error occured";

  }
}





$response = json_encode($response);
echo $response;
