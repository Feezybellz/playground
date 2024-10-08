<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1>Home</h1>

    <button type="button" name="button" onclick="editText();"> Press me</button>
    <script type="text/javascript">
      // alert("Hello")
      const colors = ["red", "blue", "pink", "yellow"];

      const editText = ()=>{
        document.querySelector("h1").style.color = colors[ Math.floor(Math.random() * (colors.length - 1))]
      }
    </script>
  </body>
</html>
