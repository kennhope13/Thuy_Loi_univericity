

// slider
$(document).ready(function(){
  $("#btnReset").click(function(){
    var email = $("#txt_Email").val();
    $.get("./forgotPassword", {
      email: email,
  }, function (data) {
    console.log("data",data);
    alert("gửi Email thành công!!");
    window.location = `/login`;
      // if (data.userType == 0) {      
      //     window.location = `/index?email=${us}`;
      // } else {
      //   window.location = `/admin?email=${us}`;
      // }
  })
  })

  $("#resetPasword").click(function(){
    var password = $("#txt_password").val();

    // Lấy phần đường dẫn từ URL
    var path = window.location.pathname;

    // Trích xuất phần token từ đường dẫn URL
    var tokens = path.split('/');
    var token = tokens[tokens.length - 1];

    // Kiểm tra xem có giá trị token hay không
    if (token) {
        // Sử dụng giá trị token cho công việc của bạn
        console.log("Password:", password);
        console.log("Token:", token);
        $.post("./resetPassword", {
          password: password,
          token: token
      }, function (data) {
        console.log("data",data);
          // if (data.userType == 0) {      
          //     window.location = `/index?email=${us}`;
          // } else {
          //   window.location = `/admin?email=${us}`;
          // }
          alert("doi mat khau thanh cong");
          window.location = `/login`;
      })

    } else {
        console.error("Token not found in the URL");
    }
  });
  $("#btn-login").click(function(){
    var us = $("#txt_username").val();
    var pw = $("#txt_password").val();
    $.post("./login", {
        Email: us,
        Password: pw
    }, function (data) {
      console.log("data",data);
        if (data.userType == 0) {      
            window.location = `/index?email=${us}`;
        } else {
          window.location = `/admin?email=${us}`;
        }
    })
  })
  $("#home").click(function(){
      window.location="/index";
  })

  // createUser
  $("#btnSubmit-Signup").click(function(){
    var Email=$("#txtemail").val();
    var Password=$("#txtpassword").val();
    var Name=$("#txtname").val();
    var address=$("#txtaddress").val();
    var mobile=$("#txtmobile").val();
   var data = {Email:Email,Password:Password,Name:Name,address:address,mobile:mobile};
    // Gửi yêu cầu POST với dữ liệu FormData
    jQuery.ajax({
    url: './Register',
    data: data,
    cache: false,
    method: 'POST',
    type: 'POST',
    success: function (data) {
        if(data.result==1){
            window.location = "./login";
            alert("tao tai khoan thanh cong hay dang nhap");
        }else{
            alert("tao tai khoan that bai")
        }
    }
    });
});
$("#login-lay").click(function(){
  var token = getCookie("jwt");
    var data = { Token: token };
    console.log("data", data);
  jQuery.ajax({
      url: './logout',
      data: data,
      cache: false,
      method: 'POST',
      type: 'POST',
      success: function (data) {
          if(data.result==1){
              window.location = "./index";
              alert("Logout account thanh cong");
          }else{
              alert("Logout account that bai");
          }
      }
  });

});
// show list user

$.post("./listuser", function (data) {
  console.log(data);
  if(data.result==1){
      data.userdata.forEach(function(dt,k){
          k=k+1;
          $("#listuser").append(`
              <tr>
                  <td class="text-center">`+ k + `</td>
                  <td class="txt-oflo">`+ dt.Name + `</td>
                  <td><span class="badge bg-success rounded-pill">`+ dt.Active + `</span> </td>
                  <td><span class="text-success">`+ dt.Email + `</span></td>
                  <td class="txt-oflo"><span><img style="width: 80px"  class="avatar" src="./`+ dt.Avatar + `" alt=""></span></td>
                  <td><span class="text-success">`+ dt.mobile + `</span></td>
                  <td>
                  <div class=" dropdown mega-dropdown"> <a
                  class="nav-link  waves-effect waves-dark edit_user"  id="`+ dt._id + `" data-bs-toggle="dropdown"><i  class="ti-marker-alt "></i> </a>
                  <a class="delete_user text-inverse"  id="` + dt._id + `" title="" data-bs-toggle="tooltip" data-original-title="Delete"><i class="ti-trash"></i></a>
              <div class="dropdown-menu animated bounceInDown" >
              <div class="mega-dropdown row" >
                <div class = "listedit">
                </div>

          </div>
              </div>
          </div>
          </td>
              </tr>
          `)
      })
  }
  $('.delete_user').on('click', function(e){
    var id = $(this).attr('id');
    var confirmDelete = confirm("Bạn có chắc muốn xóa nguoi dung nay khong ?");
    if(confirmDelete){
        $.ajax({
            type: 'GET',
            method: 'GET',
            url: '/delete/'+id,
            success: function(response){
                window.location = "./users";
            },
            error: function(err){
                console.log(err);
            }
        });
    }
  });
  $('.edit_user').on('click', function () {
      var id = $(this).attr('id');
      $.ajax({
        type: 'GET',
        method: 'GET',
        url: '/edit/' + id,
        success: function (response) {
          $('.listedit').html('');
          $('.listedit').append(`
                    <div class="col-lg-12 m-b-30 text-center">
                        <h4 class="m-b-20" >CHỈNH SỬA NGƯỜI DÙNG</h4>
                        <!-- Accordian -->
                        <div class="accordion" id="accordionExample">
                            <div class="card m-b-0">
                                <div class="form-group">
                                    <input style="width: 50%" type="text" value= "`+ response.data.Name + `" class="txt_editname form-control"
                                        placeholder="Enter Name">
                                </div>
                                <div class="form-group">
                                    <label for="myCheckbox"></label>
                                    <input style="margin-right:450px" value="`+ response.data.Active + `" type="checkbox" id="myEditCheckbox">
                                </div>
                                
                                <div class="form-group">
                                    <input style="width: 50%" type="email" class="form-control txt_Editemail"
                                        placeholder="Enter email" value="`+ response.data.Email + `">
                                </div>
                                <div class="form-group">
                                    <input style="width: 50%;  margin-left: 6%;" type="file" class="form-control"
                                        id="txt_FileImage">
                                    <img id="imgProduct" style="width: 60px;" class="avatar" src="./upload/default.jpg"
                                        alt="">
                                    <input style="width: 50%;" type="hidden" id="hid_avt" value="./upload/`+ response.data.Avatar + `">
                                    <input   type="button" class="btn_EditUploadImage"
                                        value="Done!!">
                                </div>
                                <div class="form-group">
                                    <input style="width: 50%;" type="text" class="txt_EditphoneNum form-control"
                                        placeholder="Enter phone number"  value="`+ response.data.mobile + `">
                                </div>

                            </div>
                            <button class="btn btn-info text-white btn_edit"  >UPDATE</button>
                        </div>
                    </div>
          `);
          $(".btn_EditUploadImage").click(function () {
            var data = new FormData();
            jQuery.each(jQuery('#txt_FileImage')[0].files, function (i, file) {
              data.append('avatar', file);
            });

            jQuery.ajax({
              url: './uploadfile',
              data: data,
              cache: false,
              contentType: false,
              processData: false,
              method: 'POST',
              type: 'POST', // For jQuery < 1.9
              success: function (data) {
                if (data.result == 1) {
                  console.log("user: ", data);
                  $("#imgProduct").attr("src", "upload/" + data.info.filename);
                  $("#hid_avt").attr("value", "upload/" + data.info.filename);
                } else {
                  alert(data.message);
                }
              }
            });
          });
          $('.btn_edit').on('click', function () {
            var Name = $(".txt_editname").val();
            var Email = $(".txt_Editemail").val();
            var img = $("#hid_avt").val();
            var phoneNumber = $(".txt_EditphoneNum").val();

            // if (ck.checked) {
            //   ck.checked = false;
            //   console.log("false: ", ck);
            // } else {
            //   ck.checked = true;
            //   console.log("true: ", ck);
            // }
            // var data = { Name: Name, Active: ck, Email: Email, Avatar: img, mobile: phoneNumber };
            var data = { Name: Name, Email: Email, Avatar: img, mobile: phoneNumber };
            console.log("ss", data);
            jQuery.ajax({
              url: './edit_user/' + id,
              data: data,
              cache: false,
              method: 'POST',
              type: 'POST',
              success: function (data) {
                if (data.result == 1) {
                  alert("Chinh sua người dùng thành công.");
                  window.location = "./users";
                } else {
                  //alert(data.message);
                  console.log("err", data);
                }
              }
            })
          })
        },
        error: function (err) {
          console.log(err);
        }
      });
  });
});
$("#btn_add").click(function(){
  var name = $("#txt_name").val();
  var checkbox = $("#myCheckbox").prop("checked");
  var pw = $("#txt_password").val();
  var email = $("#txt_email").val();
  var phone = $("#txt_phoneNum").val();
  var avatar = $("#hid_avt").val()
    if (checkbox.checked) {
      checkbox.checked = false;
      console.log("false: ", checkbox);
    } else {
      checkbox.checked = true; 
      console.log("true: ", checkbox);
    }
  var data = {Name:name, Active:checkbox, Password:pw, Email:email,Avatar:avatar, mobile:phone}
  jQuery.ajax({
    url: './Register',
    data: data,
    cache: false,
    method: 'POST',
    type: 'POST', // For jQuery < 1.9
    success: function(data){
        if(data.result==1){
            alert("Thêm người dùng thành công.");
            window.location="./users";
        }else{
            alert(data.message);
        }
    }
});
data.Password="đã che!!!";
console.log(data);
})
$.post("./create_new",function(data){
  
})
// show list athors
$.post("./listauthor", function (data) {
  console.log(data);
  if(data.result==1){
      data.userdata.forEach(function(dt,k){
          k=k+1;
          $("#listauthor").append(`
            <tr>
                <td class="text-center">`+k+`</td>
                <td class="txt-oflo">`+dt.name+`</td>
                <td><span class="text-success">`+dt.email+`</span></td>
                <td><span class="text-success">`+dt.dateOfBirth+`</span></td>
                <td class="txt-oflo"><span><img class="avatar" src="./upload/avatar.png" alt=""></span></td>
                <td><span class="text-success">`+dt.createdAt+`</span></td>
                <td><span class="text-success">`+dt.updatedAt+`</span></td>
                <td><a href="javascript:void(0)" class="text-inverse p-r-10" data-bs-toggle="tooltip" title="" data-original-title="Edit"><i class="ti-marker-alt"></i></a> <a class="Delete_users text-inverse" id="`+dt._id+`" title="" data-bs-toggle="tooltip" data-original-title="Delete"><i class="ti-trash"></i></a></td>
            </tr> 

          `)
      })
  }
});
// show list topic
$.get("./listTopic", function (data) {
  console.log(data);
  if(data.result==1){
    $("#topic").html(`
        <select name="select" id="select_categories" required class="form-select topic_append">
            <option value="-1">Các chủ đề</option>
        </select>`
    );
    data.userdata.forEach(function(dt,k){
      $(".topic_append").append(`
      <option value="` + dt._id + `" data-topic-id="` + dt._id + `" class="topicOption">` + dt.topic_slug + `</option>'
      `)
    })
      
      
  }
});
// show list article admin
$.post("./listarticle", function (data) {
  console.log(data);
  if(data.result==1){
      data.userdata.forEach(function(dt,k){
          k=k+1;
          $("#listarticle").append(`
            <tr>
                <td class="text-center">`+k+`</td>
                <td class="txt-oflo">`+dt.article_name+`</td>
                <td><span class="badge bg-success rounded-pill">sale</span> </td>
                <td class="txt-oflo"><span><img style="width: 80px"  class="avatar" src="./`+dt.images+`" alt=""></span></td>
                <td><span class="text-success">`+dt.article_author+`</span></td>
                <td><a href="javascript:void(0)" class="text-inverse p-r-10" data-bs-toggle="tooltip" title="" data-original-title="Edit"><i class="ti-marker-alt"></i></a> <a class="text-inverse" title="" data-bs-toggle="tooltip" data-original-title="Delete"><i class="ti-trash"></i></a></td> 
            </tr>
          `)
      }
      )
      
      
  }
});

// show list article index
$.get("./listHome", function (data) {
  console.log(data);
  if(data.result==1){
      data.userdata.forEach(function(dt,k){
        // Cắt chuỗi dt.describe chỉ lấy 15 từ
        var truncatedDescription = dt.describe.split(' ').slice(0, 30).join(' ');
          $("#article_index").append(`
          <div class="row">
            <div class="col-lg-6">
              <img src="`+dt.images+`" alt="computer-lab" class="card-img rounded" style="width: 350px; max-height: 200px; margin-bottom: 10px;">
            </div>
            <div class="col-lg-6">
              <div>
                <b > `+dt.article_name+`</b>
                <p> `+truncatedDescription+`...	</p>
              </div>
            </div>
        </div>
          `)
      }
      )
      
      
  }
});
// upload file
$("#btnUploadImage").click(function(){
  var data = new FormData();
  jQuery.each(jQuery('#txtFileImage')[0].files, function(i, file) {
      data.append('avatar', file);
  });

  jQuery.ajax({
      url: './uploadfile',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      success: function(data){
          if(data.result==1){
            console.log("user: ",data);
              $("#imgProduct").attr("src","upload/" + data.info.filename);
              $("#hid_avt").attr("value","upload/" + data.info.filename);
          }else{
              alert(data.message);
          }
      }
  });
});

//add data product database
$("#btnSubmit_addArticle").click(function(){
  var data = new FormData();

  data.append("article_name", $("#txtname").val());
  // data.append("category_id", $("#select_categories").val());
  data.append("images", $("#hid_avt").val());
  data.append("describe", $("#textarea").val());
  var selectedTopicId = $("#select_categories").find(':selected').attr('data-topic-id');
  data.append("topic_Article", selectedTopicId);
  // Gửi yêu cầu POST với dữ liệu FormData
  jQuery.ajax({
  url: './addArticle',
  data: data,
  cache: false,
  contentType: false,
  processData: false,
  method: 'POST',
  type: 'POST',
  success: function (data) {
      if(data.result==1){
        alert("them bai viet thanh cong");
       window.location = "./article";
      }else{
        alert("them bai viet that bai");
      }
  }
  });
});
})
// delete_user

let slideIndex = 1;
//showSlides(slideIndex);
showSlides();
function getTokenByUser(){
  $.post("./get-user-byToken", function(data){
    console.log("data token", data);
  })
}
// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}


// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;

  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000);
}
