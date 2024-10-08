<script type="text/javascript">
  function lazyLoad (){
    return{
      init:function (props = {}){

        if (Object.keys(props).length > 0) {
          var elements = props.elements
        }else{
          var elements = Array.from(document.querySelectorAll("img"));
        }


        const styles = `
                <style>

                .skeleton-box {
                 display: inline-block;
                 position: relative;
                 overflow: hidden;
                 background: #e6e6e6 !important;
                 background-image: #e6e6e6 !important;

              }
               .skeleton-box::after {
                 position: absolute;
                 top: 0;
                 right: 0;
                 bottom: 0;
                 left: 0;
                 transform: translateX(-100%);
                 background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0)) !important;
                 animation: shimmer-effect 1.5s infinite;
                 content: '';
              }
               @keyframes shimmer-effect {
                 100% {
                   transform: translateX(100%);
                }
              }



              .shine {
                background: #f6f7f8 !important;
                background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%) !important;
                background-repeat: no-repeat !important;
                background-size: 800px 104px !important;
                display: inline-block !important;
                position: relative !important;


                -webkit-animation-duration: 1s ;
                -webkit-animation-fill-mode: forwards ;
                -webkit-animation-iteration-count: infinite ;
                -webkit-animation-name: placeholderShimmer ;
                -webkit-animation-timing-function: linear ;

                animation-duration: 1s ;
                animation-fill-mode: forwards ;
                animation-iteration-count: infinite ;
                animation-name: placeholderShimmer ;
                animation-timing-function: linear ;
                }


                @-webkit-keyframes placeholderShimmer {
                  0% {
                    background-position: -200% 0;
                  }

                  100% {
                    background-position:200% 0;
                  }
                }


              @keyframes placeholderShimmer {
                0% {
                  background-position: -200% 0;
                }

                100% {
                  background-position:200% 0;
                }
              }



            .animate {
              animation: shimmer 1s;
              animation-iteration-count: infinite;
              background: linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) !important;
              background-size: 1200px 100% !important;

            }


            .shimmerBG {
              animation-duration: 1.5s;
              animation-fill-mode: forwards;
              animation-iteration-count: infinite;
              animation-name: shimmer;
              animation-timing-function: linear;
              background: #ddd;
              background: linear-gradient(to right, #F6F6F6 8%, #F0F0F0 18%, #F6F6F6 33%);
              background-size: 100% 100%;
          }


          @-webkit-keyframes shimmer {
              0% {
                  background-position: -100% 0;
              }
              100% {
                  background-position: 100% 0;
              }
          }

          @keyframes shimmer {
              0% {
                  background-position: -1200px 0;
              }
              100% {
                  background-position: 1200px 0;
              }
          }

            @keyframes shimmer {
              from {
                background-position: -100% 0;
              }
              to {
                background-position: 100% 0;
              }
            }


                </style>
            `

            document.querySelector("head").insertAdjacentHTML("beforeend", styles);

            function addLazyLoad(element){
              const previousDisplay = element.style.display;

              const newDiv = document.createElement("div");
              newDiv.style = element.style;
              // newDiv.style.height = window.getComputedStyle(element).height;
              // newDiv.style.width = window.getComputedStyle(element).width;
              newDiv.className = element.className;
              // newDiv.classList.add("shimmerBG");
              newDiv.classList.add("skeleton-box");

              // element.style.setProperty("display", "none", "important");
              // element.parentNode.insertBefore(newDiv, element);


              element.replaceWith(newDiv);


              const imageUrl = element.dataset.src;
              const newImage = document.createElement("img");
              newImage.src = imageUrl;
              newImage.addEventListener("load", function() {
                element.src = imageUrl
                element.style.backgroundImage = `url(${imageUrl})`
                newDiv.replaceWith(element);

              });
            }


            if ((elements instanceof Array)) {
              elements.map((elem)=>{
                if (!(elem instanceof Element)) {
                  throw new Error('A valid DOM Element is required');
                }else{
                  addLazyLoad(elem)
                }
              })
            }else{
              if (!(elements instanceof Element)) {
                throw new Error('A valid DOM Element is required');
              }else{
                addLazyLoad(elem)

              }
            }


      }
    }
  }


  const lazyImages = Array.from(document.querySelectorAll("[data-lazyload]"));

  lazyLoad().init({elements:lazyImages});
</script>
