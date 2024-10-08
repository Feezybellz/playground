
<?php
$site_name = "ADMC";
$description = "Booking ";
$logo_directory = "./images/logo.png";


// $_GET['client'];
    $uri2 = "feezytech";

  if (isset($_GET)) {
    $uri2 = explode("?", $uri2)[0];
  }

  if (isset($_GET['client'])) {
    $client_id = base64_decode($_GET['client']);
    // $clientInfo = selectContent($conn, "panel_contact", ['id'=>$client_id]);


    if (count($clientInfo) < 1) {
    die("Invalid entry 003");
    }
    $client_info = $clientInfo[0];

  }


  // $business = selectContent($conn, "read_businesses", ['booking_url' => $uri2]);
  $business = [['id'=>1, 'input_business_name'=>"FeezyTech", 'booking_setting'=>'a:7:{s:6:"sunday";a:1:{s:12:"availability";b:0;}s:6:"monday";a:2:{s:12:"availability";b:1;s:4:"time";a:2:{s:4:"open";s:5:"00:00";s:5:"close";s:5:"23:59";}}s:7:"tuesday";a:2:{s:12:"availability";b:1;s:4:"time";a:2:{s:4:"open";s:5:"00:00";s:5:"close";s:5:"23:59";}}s:9:"wednesday";a:1:{s:12:"availability";b:0;}s:8:"thursday";a:1:{s:12:"availability";b:0;}s:6:"friday";a:1:{s:12:"availability";b:0;}s:8:"saturday";a:1:{s:12:"availability";b:0;}}'], 'booking_url'=>'feezytech',];
  $msg = false;

  if(count($business) > 0){
    $business = $business[0];
    //var_dump($business);
    $page_title = $business['input_business_name'];

    if(@unserialize($business['booking_setting'])){

    $bookingDatesArray = unserialize($business['booking_setting']);

    $daysOfWeekArr = [
      "sunday","monday","tuesday","wednesday","thursday","friday","saturday",
    ];

    foreach ($bookingDatesArray as $dayKey => $day){

      if($day['availability'] == true){
      $currentYear = date("Y");


      $nextYear = date("Y")+1;

      //var_dump($nextYear);
      //Set The Day of the month as key and the day name as value
      $availableDaysOfWeek[(array_keys($daysOfWeekArr, $dayKey)[0])] = $dayKey;


      //$endDate = strtotime($endDate);
      for($i = strtotime($dayKey, strtotime($currentYear)); $i <= strtotime("January 01 ".$nextYear); $i = strtotime('+1 week', $i)){

          $availableDays[] = date('Y-m-d', $i);
      }


      }
    }


    //die(var_dump($availableDays));
    }

  }else{
    die("404");
  }


$page_title = $business['input_business_name'];

$personnels = fetchData();

  ?>


<!DOCTYPE html>

<html lang="en">
	<!--begin::Head-->

<meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->
<head>
  <title>
    <?php $title = $page_title ?? NULL ?>
    <?php if ($title == "home" || $title == NULL): ?>
      <?php echo $site_name ?>
    <?php else: ?>
      <?php echo $site_name ?> - <?php echo $title ?> Booking
    <?php endif; ?>
  </title>
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
  <!--begin::Global Stylesheets Bundle(used by all pages)-->
  <link href="./assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
  <link href="./assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://kit.fontawesome.com/24038fcef1.js" crossorigin="anonymous"></script>
      <link rel="stylesheet" href="../assets/css/booking-form-updated.css">
    <script src="/ajax/ajax.min.js"></script>
	<link rel="stylesheet" href="assets/css/booking-form-updated.css">
		<!--End::Google Tag Manager -->
	</head>
	<!--end::Head-->
	<!--begin::Body-->

	<body id="kt_body">
		<!--begin::Main-->

				<div class="upt-my-div">
								<div class="upt-form-div">
									<div class="upt-form-correction">
									<button class="fa-button"><i class="fa-solid fa-xmark"></i></button>
									<form class="form" method="post" novalidate="novalidate" id="bookingForm">
										<!--begin::Heading-->
										<div class="text-center mb-10">
											<!--begin::Title-->
											<h1 class="text-dark mb-3">Fill Form Below</h1>
											<!--end::Title-->
											<!--begin::Link-->
										<?php if ($msg == true): ?>
										<div class='alert alert-success'><b><?=$form[0]['input_form_submission_title']?>: <?=$form[0]['text_form_submission_message']?></b></div>

										<?php endif; ?>

														<!--end::Link-->
													</div>
													<!--begin::Heading-->
										<!--begin::Input group-->
										<div class="mb-10">
										<!--begin::Label-->
										<label class="">
											<span class="required">Name</span>
											<!-- <i class="fas fa-exclamation-circle ms-2 fs-7"></i> -->
										</label>
										<!--end::Label-->
										<!--begin::Input-->
										<input type="text" id="name" class="form-control form-control-lg form-control-solid" name="name" placeholder="" value="<?=$client_info['input_contact_name']  ?? ""?>" />
										<!--end::Input-->
										</div>

										<div class="mb-10">
										<!--begin::Label-->
										<label class="">
											<span class="required">Email</span>
											<!-- <i class="fas fa-exclamation-circle ms-2 fs-7"></i> -->
										</label>
										<!--end::Label-->
										<!--begin::Input-->
										<input type="text" id="email" class="form-control form-control-lg form-control-solid" name="email" placeholder="" value="<?=$client_info['input_email'] ?? ""?>" />
										<!--end::Input-->
										</div>

										<div class="mb-10">
										<!--begin::Label-->
										<label class="">
											<span class="required">Phone Number</span>
											<!-- <i class="fas fa-exclamation-circle ms-2 fs-7"></i> -->
										</label>
										<!--end::Label-->
										<!--begin::Input-->
										<input type="text" id="phone_no" class="form-control form-control-lg form-control-solid" name="phone_no" placeholder="" value="<?=$client_info['input_phone'] ?? ""?>" />
										<!--end::Input-->
										</div>
										<div class="mb-10">
										<button type="button" class="btn btn-primary" onclick="bookBizFunc(this)">
											<span class="indicator-label">Book <?=$title?></span>
											<span class="indicator-progress">Please wait...
											<span class="spinner-border spinner-border-sm align-middle ms-2"></span></button>
										</div>
									</form>
									</div>
								</div>
					<div class="upt-overall">
						<div class="d-flex flex-column flex-lg-row-fluid upt-left">
							<!--begin::Wrapper-->
							<div class="d-flex flex-row-fluid flex-center p-10 upt-max-top">
								<!--begin::Content-->
								<div class="d-flex flex-column upt-mini-column">
									<a href="" class="mb-15">
										<img alt="Logo" src="<?php echo $logo_directory ?>" class="h-40px" />
									</a>
									<h1 class="text-dark fs-2x mb-3"><?=ucwords($page_title)?> Booking</h1>
									<!--end::Title-->
									<!--begin::Description-->
									<div class="fw-bold fs-4 text-gray-400 mb-10">Welcome guest! Kindly fill the form to book <?=ucwords($page_title)?>.</div>
								</div>
							</div>
							<!--end::Wrapper-->
							<div class="container upt-container">
								<div class="upt-extra">
									<div class="upt-form-click">
										<p class="upt-p-click">To fill The form below</p>
										<button class="upt-button">Click here</button>
									</div>
									<!-- <svg class="upt-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,224L40,240C80,256,160,288,240,293.3C320,299,400,277,480,272C560,267,640,277,720,240C800,203,880,117,960,106.7C1040,96,1120,160,1200,160C1280,160,1360,96,1400,64L1440,32L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg> -->
								</div>
                <div class="">
                  <select class="" name="">
                    <option value="" disabled> --Select Personel-- </option>
                    <?php foreach ($personnels as $key => $value){ ?>
                      <option value="<?=$value['id']?>"><?=$value['input_name']?></option>
                    <?php }; ?>
                  </select>
                </div>
								<div class="upt-new-add">
									<img src="images/carl.png" class="upt-new-add-img" alt="">
										<div class="calendar-assets">
											<h1 id="currentDate" class="calendar-assets-h1"></h1>
											<div class="field">
												<label for="date">Jump To Date</label>
												<form class="form-input" id="date-search" onsubmit="return setDate(this)">
													<input type="date" class="text-field" name="date" id="date" required>
													<button type="submit" class="btn btn-small" title="Pesquisar"><i class="fas fa-search"></i></button>
												</form>
											</div>
											<div class="day-assets">
												<button class="btn" onclick="prevDay()" title="Previous Day"><i class="fas fa-chevron-left"></i> Prev.  Day </button>
												<button class="btn" onclick="resetDate()" title="Today"><i class="fas fa-calendar-day"></i> Today</button>
												<button class="btn" onclick="nextDay()" title="Next Day"><span>Next Day</span> &nbsp;  <i class="fas fa-chevron-right"></i> </button>
											</div>
										</div>


										<div class="calendar" id="table">
											<div class="header">
												<!-- Aqui é onde ficará o h1 com o mês e o ano -->
												<div class="month" id="month-header">

												</div>
												<div class="buttons">
													<button class="icon" onclick="prevMonth()" title="Previous Month"><i class="fas fa-chevron-left"></i></button>
													<button class="icon" onclick="nextMonth()" title="Next Month"><i class="fas fa-chevron-right "></i></button>
												</div>
											</div>
										</div>

										<div class="" style="margin-top: 10px;">
											<input type="time" id="bookingTimeInput" class="bg-body form-control form-control-lg form-control-solid">
										</div>
								</div>

							</div>
							<!-- <div class="testing"></div> -->
						</div>
					</div>

				</div>

                <script type="text/javascript">
                  var availableDates = <?=json_encode($availableDays)?>;

                  const months = [
					        "Jan",
					        "Feb",
					        "Mar",
					        "Apr",
					        "May",
					        "Jun",
					        "Jul",
					        "Aug",
					        "Sep",
					        "Oct",
					        "Nov",
					        "Dec"
					      ];

      					const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];



      					// Váriavel principal
      					let date = new Date();

      					// Função que retorna a data atual do calendário
      					function getCurrentDate(element, asString) {
      					    if (element) {
      					        if (asString) {
      					            return element.textContent = weekdays[date.getDay()] + ', ' + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
      					        }
      					        return element.value = date.toISOString().substr(0, 10);
      					    }
      					    return date;
      					}


      					// Função principal que gera o calendário
      					function generateCalendar() {

      					    // Pega um calendário e se já existir o remove
      					    const calendar = document.getElementById('calendar');
      					    if (calendar) {
      					        calendar.remove();
      					    }

      					    // Cria a tabela que será armazenada as datas
      					    const table = document.createElement("table");
      					    table.id = "calendar";

      					    // Cria os headers referentes aos dias da semana
      					    const trHeader = document.createElement('tr');
      					    trHeader.className = 'weekends';
      					    weekdays.map(week => {
      					        const th = document.createElement('th');
      					        const w = document.createTextNode(week.substring(0, 3));
      					        th.appendChild(w);
      					        trHeader.appendChild(th);
      					    });

      					    // Adiciona os headers na tabela
      					    table.appendChild(trHeader);

      					    //Pega o dia da semana do primeiro dia do mês
      					    const weekDay = new Date(
      					        date.getFullYear(),
      					        date.getMonth(),
      					        1
      					    ).getDay();

      					    //Pega o ultimo dia do mês
      					    const lastDay = new Date(
      					        date.getFullYear(),
      					        date.getMonth() + 1,
      					        0
      					    ).getDate();

      					    let tr = document.createElement("tr");
      					    let td = '';
      					    let empty = '';
      					    let btn = document.createElement('button');
      					    let week = 0;

      					    // Se o dia da semana do primeiro dia do mês for maior que 0(primeiro dia da semana);
      					    while (week < weekDay) {
      					        td = document.createElement("td");
      					        empty = document.createTextNode(' ');
      					        td.appendChild(empty);
      					        tr.appendChild(td);
      					        week++;
      					    }

      					    // Vai percorrer do 1º até o ultimo dia do mês
      					    for (let i = 1; i <= lastDay;) {
      					        // Enquanto o dia da semana for < 7, ele vai adicionar colunas na linha da semana
      					        while (week < 7) {
      					            td = document.createElement('td');
      					            let text = document.createTextNode(i);
      					            var theMonth = (date.getMonth()+1).toString().padStart(2, 0);
      					            var theYear = date.getFullYear();
      					            // console.log(i)
      					            var theDay = (i).toString().padStart(2, 0);
      					            var fullDate = `${theYear}-${theMonth}-${theDay}`
      					            btn = document.createElement('button');
      					            btn.className = "btn-day";
      					            // btn.dataset.date =
      					            btn.addEventListener('click', function () { changeDate(this) });
      					            btn.addEventListener('click', function () { selectDate(this) });
      					            week++;



      					            // Controle para ele parar exatamente no ultimo dia
      					            if (i <= lastDay) {
      					                i++;


      					                btn.appendChild(text);
      									btn.dataset.date = fullDate;

      					                // console.log(i)
      					                td.appendChild(btn)

                                          if (!availableDates.includes(fullDate)) {
                                              btn.style.pointerEvents = "none";
                                              btn.style.color = "#808080";
                                          }else{
                                              btn.style.fontWeight = "bold";
                                          }

      					            } else {
      					                text = document.createTextNode(' ');
      					                td.appendChild(text);
      					            }
      					            tr.appendChild(td);
      					        }
      					        // Adiciona a linha na tabela
      					        table.appendChild(tr);

      					        // Cria uma nova linha para ser usada
      					        tr = document.createElement("tr");

      					        // Reseta o contador de dias da semana
      					        week = 0;
      					    }
      					    // Adiciona a tabela a div que ela deve pertencer
      					    const content = document.getElementById('table');
      					    content.appendChild(table);
      					    changeActive();
      					    changeHeader(date);
      					    // console.log(date,date.toLocaleString('en-US'));
      					    // document.getElementById('date').textContent = date;
      					    // document.getElementById('date').textContent = date.toLocaleString('en-US');

      					    getCurrentDate(document.getElementById("currentDate"), true);
      					    getCurrentDate(document.getElementById("date"), false);
      					}

      					// Altera a data atráves do formulário
      					function setDate(form) {
                              // console.log(form.date.value)
                              if((availableDates.includes(form.date.value))){
                    					    let newDate = new Date(form.date.value);
                    					    date = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 1, 0, 0);

                                  booking_date = form.value;
      					                  generateCalendar();
      					    return false;
                              }else{
                                  alert("Business is not available on this date ")
                                  return false;
                              }
      					}

      					// Método Muda o mês e o ano do topo do calendário
      					function changeHeader(dateHeader) {
      					    const month = document.getElementById("month-header");
      					    if (month.childNodes[0]) {
      					        month.removeChild(month.childNodes[0]);
      					    }
      					    const headerMonth = document.createElement("h1");
      					    const textMonth = document.createTextNode(months[dateHeader.getMonth()].substring(0, 3) + " " + dateHeader.getFullYear());
      					    headerMonth.appendChild(textMonth);
      					    month.appendChild(headerMonth);
      					}

      					// Função para mudar a cor do botão do dia que está ativo
      					function changeActive() {
      					    let btnList = document.querySelectorAll('button.active');
      					    btnList.forEach(btn => {
      					        btn.classList.remove('active');
      					    });
      					    btnList = document.getElementsByClassName('btn-day');
      					    for (let i = 0; i < btnList.length; i++) {
      					        const btn = btnList[i];
      					        if (btn.textContent === (date.getDate()).toString()) {
      					            btn.classList.add('active');
                                      booking_date = btn.dataset.date;
      					        }
      					    }
      					}

      					// Função que pega a data atual
      					function resetDate() {
      					    date = new Date();
      					    generateCalendar();
      					}

      					// Muda a data pelo numero do botão clicado
      					function changeDate(button) {
      					    let newDay = parseInt(button.textContent);
      					    date = new Date(date.getFullYear(), date.getMonth(), newDay);
      					    generateCalendar();
      					}

      					function selectDate(elem){
      						let selectedDay = (parseInt(elem.textContent) >= 10) ? parseInt(elem.textContent) : (elem.textContent.padStart(2, 0));
      						var selectedDate = elem.dataset.date;
                              booking_date = selectedDate;

      						console.log(selectedDate)

      					}

      					// Funções de avançar e retroceder mês e dia
      					function nextMonth() {
      					    date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      					    generateCalendar(date);
      					}

      					function prevMonth() {
      					    date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      					    generateCalendar(date);
      					}


      					function prevDay() {
      					    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
      					    generateCalendar();
      					}

      					function nextDay() {
      					    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      					    generateCalendar();
      					}

      					document.onload = generateCalendar(date);


                </script>
						</form>


						<!--end::Form-->
					</div>
					<!--end::Wrapper-->
				</div>
				<!--end::Right Content-->
			</div>
			<!--end::Authentication - Signup Free Trial-->
		</div>
		<!--end::Main-->
		<script>var hostUrl = "https://preview.keenthemes.com/metronic8/demo1./assets/";</script>
		<!--begin::Javascript-->
		<!--begin::Global Javascript Bundle(used by all pages)-->
		<script src="../../.../assets/plugins/global/plugins.bundle.js"></script>
		<script src="../../.../assets/js/scripts.bundle.js"></script>
		<!--end::Global Javascript Bundle-->
		<!--begin::Page Custom Javascript(used by this page)-->
		<script src="../../.../assets/js/custom/authentication/sign-up/free-trial.js"></script>
		<!--end::Page Custom Javascript-->
		<!--end::Javascript-->
		<!--Begin::Google Tag Manager (noscript) -->
		<noscript>
			<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5FS8GGP" height="0" width="0" style="display:none;visibility:hidden"></iframe>
		</noscript>
		<!--End::Google Tag Manager (noscript) -->
	</body>
	<!--end::Body-->

<!-- Mirrored from preview.keenthemes.com/metronic8/demo1/dark/authentication/extended/free-trial-sign-up.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 01 Nov 2021 14:38:02 GMT -->
</html>
