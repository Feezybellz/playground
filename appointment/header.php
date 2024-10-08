<?php

	// $userId = $_SESSION['id'];
	// $userInfo = selectContent($conn, "users", ['hash_id'=>"$userId"]);


	$userInfo = [['firstname','lastname','email', ]];
	$description = "";
	$logo_directory = "./images/logo.png";

 ?>

 <!DOCTYPE html>

 <html lang="en">
 	<!--begin::Head-->
 	<head>
 		<title><?php echo $page_title." - " ?? "" ?> <?php echo $site_name ?></title>
 		<meta charset="utf-8" />
		<meta name="description" content="<?php echo $description ?>" />
		<meta name="keywords" content="<?php echo $site_name ?>, bootstrap, bootstrap 5, Angular, VueJs, React, Laravel, admin themes, web design, figma, web development,  bootstrap theme, bootstrap template, bootstrap dashboard, bootstrap dak mode, bootstrap button, bootstrap datepicker, bootstrap timepicker, fullcalendar, datatables, flaticon" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta property="og:locale" content="en_US" />
		<meta property="og:type" content="article" />
		<meta property="og:title" content="<?php echo $site_name ?> - <?php echo $description ?>" />
		<meta property="og:url" content="<?=$_SERVER['HTTP_HOST']?>" />
		<meta property="og:site_name" content="<?php echo $site_name ?>" />
		<link rel="canonical" href="<?=$_SERVER['HTTP_HOST']?>" />
		<link rel="shortcut icon" href="<?php echo $logo_directory ?>" />
 		<!--begin::Fonts-->
 		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />
 		<!--end::Fonts-->
		<!--begin::Page Vendor Stylesheets(used by this page)-->
 		<link href="./assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />
		<!-- <script src="/js/jquery-3.6.0.js" charset="utf-8"></script> -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
		<!-- <script src="//code.jquery.com/jquery-3.5.1.js" charset="utf-8"></script> -->
		    <!-- Data Tables -->
		    <link rel="stylesheet" href="://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
		    <link rel="stylesheet" href="://cdn.datatables.net/responsive/2.2.9/css/responsive.dataTables.min.css">
		    <link rel="stylesheet" href="://cdn.datatables.net/fixedheader/3.2.2/css/fixedHeader.dataTables.min.css">
		    <link rel="stylesheet" href="://cdn.datatables.net/fixedcolumns/4.0.2/css/fixedColumns.dataTables.min.css">
 		<!--end::Page Vendor Stylesheets-->
 		<!--end::Page Vendor Stylesheets-->
 		<!--begin::Global Stylesheets Bundle(used by all pages)-->
 		<link href="./assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
 		<link href="./assets/css/style.bundle.css" rel="stylesheet" type="text/css" />

		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
		<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js" integrity="sha512-AA1Bzp5Q0K1KanKKmvN/4d3IRKVlv9PYgwFPvm32nPO6QS8yH1HO7LbgB1pgiOxPtfeg5zEn2ba64MUcqJx6CA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


		<style media="screen">
			.menu-icon span{
				color:#009ef7;
			}
			.business-icon{
				font-size: 50px;
			}
		</style>
		<script src="/ajax/ajax.min.js">

		</script>

		<!-- LinkedIn JS Script Start -->

      <script src="https://platform.linkedin.com/in.js" charset="utf-8">
        api_key: "86nu70fan0c9mv"
        authorize: true
        // onLoad: onLinkedInLoad
      </script>

      <!-- <script src="https://platform.linkedin.com/in.js" type="text/javascript">lang: en_US</script> -->

    <!-- LinkedIn JS Script End -->

    <!-- Facebook JS Scripts Begin -->


    <script src="https://www.gstatic.com/charts/loader.js"></script>


    <script>
      // window.fbAsyncInit = function() {
      //   FB.init({
      //     appId      : '<?php echo getenv("FBAppId") ?>',
      //     cookie     : true,
      //     xfbml      : true,
      //     version    : 'v16.0'
      //   });

      //   // FB.AppEvents.logPageView();

      // };

      // (function(d, s, id){
      //    var js, fjs = d.getElementsByTagName(s)[0];
      //    if (d.getElementById(id)) {return;}
      //    js = d.createElement(s); js.id = id;
      //    js.src = "https://connect.facebook.net/en_US/sdk.js";
      //    fjs.parentNode.insertBefore(js, fjs);
      //  }(document, 'script', 'facebook-jssdk'));



       function fbLogin(e) {

           FB.login(function (response) {
               if (response.authResponse) {
                   // Get and display the user profile data
                   // checkLogin(e)
               	console.log(response);


               } else {

               }
           }, {scope: 'business_management,pages_show_list,public_profile,email'});
       }



    </script>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
   
    <!-- Facebook JS Scripts End -->
 		<!--end::Global Stylesheets Bundle-->
 		<!--Begin::Google Tag Manager -->
 		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&amp;l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-5FS8GGP');</script>
 		<!--End::Google Tag Manager -->

<!--Begin country state Arry from php to JS -->

	</head>
 	<!--end::Head-->
 	<!--begin::Body-->
 	<body id="kt_body" class="header-fixed header-tablet-and-mobile-fixed toolbar-enabled toolbar-fixed aside-enabled aside-fixed" style="--kt-toolbar-height:55px;--kt-toolbar-height-tablet-and-mobile:55px">
 		
    <script>
	  window.fbAsyncInit = function() {
	    FB.init({
	      appId            : '<?php echo getenv("FBAppId") ?>',
	      autoLogAppEvents : true,
	      xfbml            : true,
	      version          : 'v16.0'
	    });
	  };
	</script>
	<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
	    
 		<!--Begin::Google Tag Manager (noscript) -->
 		<!--End::Google Tag Manager (noscript) -->
 		<!--begin::Main-->
 		<!--begin::Root-->
 		<div class="d-flex flex-column flex-root">
 			<!--begin::Page-->
 			<div class="page d-flex flex-row flex-column-fluid">
 				<!--begin::Aside-->
 				<?php //include "db-aside.php" ?>
 				<!--end::Aside-->
 				<!--begin::Wrapper-->
         <!-- Start here -->
 				<div class="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
 					<!--begin::Header-->
 					<div id="kt_header" style="" class="header align-items-stretch">
 						<!--begin::Container-->
 						<div class="container-fluid d-flex align-items-stretch justify-content-between">
 							<!--begin::Aside mobile toggle-->
 							<div class="d-flex align-items-center d-lg-none ms-n2 me-2" title="Show aside menu">
 								<div class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px" id="kt_aside_mobile_toggle">
 									<!--begin::Svg Icon | path: icons/duotune/abstract/abs015.svg-->
 									<span class="svg-icon svg-icon-1">
 										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
 											<path d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z" fill="black" />
 											<path opacity="0.3" d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z" fill="black" />
 										</svg>
 									</span>
 									<!--end::Svg Icon-->
 								</div>
 							</div>
 							<!--end::Aside mobile toggle-->
 							<!--begin::Mobile logo-->
 							<div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
 								<a href="/" class="d-lg-none">
 									<img alt="Logo" src="./assets/media/logos/logo-2.svg" class="h-30px" />
 								</a>
 							</div>
 							<!--end::Mobile logo-->
 							<!--begin::Wrapper-->
 							<div class="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
 								<!--begin::Navbar-->
 								<div class="d-flex align-items-stretch" id="kt_header_nav">
 									<!--begin::Menu wrapper-->
 									<div class="header-menu align-items-stretch" data-kt-drawer="true" data-kt-drawer-name="header-menu" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="{default:'200px', '300px': '250px'}" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_header_menu_mobile_toggle" data-kt-swapper="true" data-kt-swapper-mode="prepend" data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav'}">
 										<!--begin::Menu-->

 										<!--end::Menu-->
 									</div>
 									<!--end::Menu wrapper-->
 								</div>
 								<!--end::Navbar-->
 								<!--begin::Toolbar wrapper-->
 								<div class="d-flex align-items-stretch flex-shrink-0">

 									<!--begin::User menu-->
 									<div class="d-flex align-items-center ms-1 ms-lg-3" id="kt_header_user_menu_toggle">
 										<!--begin::Menu wrapper-->
 										<div class="cursor-pointer symbol symbol-30px symbol-md-40px" data-kt-menu-trigger="click" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
 											<img src="<?php echo $userinfo[0]['image_1'] ?? "/uploads/dummy.png"?>" alt="user" />
 										</div>
 										<!--begin::User account menu-->
 										<div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px" data-kt-menu="true">
 											<!--begin::Menu item-->
 											<div class="menu-item px-3">
 												<div class="menu-content d-flex align-items-center px-3">
 													<!--begin::Avatar-->
 													<div class="symbol symbol-50px me-5">
 														<img alt="Logo" src="<?php echo $userinfo[0]['image_1'] ?? "/uploads/dummy.png"?>" />
 													</div>
 													<!--end::Avatar-->
 													<!--begin::Username-->
 													<div class="d-flex flex-column">
 														<div class="fw-bolder d-flex align-items-center fs-5"><?php echo $userInfo[0]['firstname'] ?> <?php echo $userInfo[0]['lastname'] ?>
 															<!-- <span class="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">Pro</span> -->
														</div>
 														<a href="#" class="fw-bold text-muted text-hover-primary fs-7"><?php echo $userInfo[0]['email'] ?></a>
 													</div>
 													<!--end::Username-->
 												</div>
 											</div>
 											<!--end::Menu item-->
 											<!--begin::Menu separator-->
 											<div class="separator my-2"></div>
 											<!--end::Menu separator-->
 											<!--begin::Menu item-->
 											<div class="menu-item px-5">
 												<a href="#" class="menu-link px-5">My Profile</a>
 											</div>
 											<!--end::Menu item-->
 											<!--begin::Menu item-->
 											<div class="menu-item px-5">
 												<a href="/myBusinesses" class="menu-link px-5">
 													<span class="menu-text">My Businesses</span>
 													<!-- <span class="menu-badge">
 														<span class="badge badge-light-danger badge-circle fw-bolder fs-7">3</span>
 													</span> -->
 												</a>
 											</div>
 											<!--end::Menu item-->

 											<!--begin::Menu separator-->
 											<div class="separator my-2"></div>
 											<!--end::Menu separator-->
 											<!--begin::Menu item-->
 											<div class="menu-item px-5 my-1">
 												<a href="#" class="menu-link px-5">Account Settings</a>
 											</div>
 											<!--end::Menu item-->
 											<!--begin::Menu item-->
 											<div class="menu-item px-5">
 												<a href="/logout" class="menu-link px-5">Sign Out</a>
 											</div>
 											<!--end::Menu item-->
 											<!--begin::Menu separator-->
 											<div class="separator my-2"></div>
 											<!--end::Menu separator-->
 											<!--begin::Menu item-->
 											<!-- <div class="menu-item px-5">
 												<div class="menu-content px-5">
 													<label class="form-check form-switch form-check-custom form-check-solid pulse pulse-success" for="kt_user_menu_dark_mode_toggle">
 														<input class="form-check-input w-30px h-20px" type="checkbox" value="1" name="mode" id="kt_user_menu_dark_mode_toggle" data-kt-url="" />
 														<span class="pulse-ring ms-n1"></span>
 														<span class="form-check-label text-gray-600 fs-7">Dark Mode</span>
 													</label>
 												</div>
 											</div> -->
 											<!--end::Menu item-->
 										</div>
 										<!--end::User account menu-->
 										<!--end::Menu wrapper-->
 									</div>
 									<!--end::User menu-->
 									<!--begin::Header menu toggle-->
 									<!-- <div class="d-flex align-items-center d-lg-none ms-2 me-n3" title="Show header menu">
 										<div class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px" id="kt_header_menu_mobile_toggle">
 											begin::Svg Icon | path: icons/duotune/text/txt001.svg
 											<span class="svg-icon svg-icon-1">
 												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
 													<path d="M13 11H3C2.4 11 2 10.6 2 10V9C2 8.4 2.4 8 3 8H13C13.6 8 14 8.4 14 9V10C14 10.6 13.6 11 13 11ZM22 5V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4V5C2 5.6 2.4 6 3 6H21C21.6 6 22 5.6 22 5Z" fill="black" />
 													<path opacity="0.3" d="M21 16H3C2.4 16 2 15.6 2 15V14C2 13.4 2.4 13 3 13H21C21.6 13 22 13.4 22 14V15C22 15.6 21.6 16 21 16ZM14 20V19C14 18.4 13.6 18 13 18H3C2.4 18 2 18.4 2 19V20C2 20.6 2.4 21 3 21H13C13.6 21 14 20.6 14 20Z" fill="black" />
 												</svg>
 											</span>
 											end::Svg Icon
 										</div>
 									</div> -->
 									<!--end::Header menu toggle-->
 								</div>
 								<!--end::Toolbar wrapper-->
 							</div>
 							<!--end::Wrapper-->
 						</div>
 						<!--end::Container-->
 					</div>
 					<!--end::Header-->
