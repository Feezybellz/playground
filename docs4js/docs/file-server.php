<?php
// Enable CORS (adjust as needed for your specific use case)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Path to your file
// $filePath = '/path/to/your/file.txt'; // Replace with the actual path
if (isset($_GET['file_url'])) {
  $filePath = $_GET['file_url'];
  // Read the file content
  $fileContent = file_get_contents($filePath);

  // Set appropriate headers for binary response
  header('Content-Type: application/octet-stream');
  // header('Content-Disposition: attachment; filename="file.txt"');

  // Output the file content
  echo $fileContent;
}else{
  echo json_decode(['status'=>"error"]);
}

?>
