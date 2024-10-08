<?php  ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <a href="home.php" data-parse-url>Home</a>
    <a href="https://finance.mckodev.com.ng" data-parse-url>Mckodev</a>

    <div class="" id="content">

    </div>

    <script type="text/javascript">
    function loadAndRenderPage(url) {
      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.text();
          })
          .then(html => {
              // Create a new DOMParser
              const parser = new DOMParser();

              // Parse the HTML string into a Document
              const doc = parser.parseFromString(html, 'text/html');
              console.dir(doc);

              const styles = doc.head.querySelectorAll('style');
              styles.forEach(style => {
                document.head.appendChild(style.cloneNode(true));
              });
              // Assuming you want to render the body of the fetched page into an element with id 'content'
              document.querySelector('#content').innerHTML = doc.body.innerHTML;


              // Execute scripts if any
              Array.from(doc.scripts).forEach(script => {
                  const newScript = document.createElement('script');
                  newScript.text = script.text;
                  document.body.appendChild(newScript);
              });
          })
          .catch(error => {
              console.error('Error:', error);
          });
    }

    const parseUrlElem = Array.from(document.querySelectorAll("[data-parse-url]"));
    console.log(parseUrlElem);
    parseUrlElem.map(_el=>{
      _el.addEventListener("click", function(){
        window.event.preventDefault();
        const target = event.currentTarget;
        const pageUrl = target.href;
        console.log(pageUrl);
        loadAndRenderPage(pageUrl);
      })
    });

    // Example usage
    // const pageUrl = 'https://example.com/page-to-load.html';
    // loadAndRenderPage(pageUrl);

    </script>
  </body>
</html>
