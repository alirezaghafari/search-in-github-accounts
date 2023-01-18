// add event handler for submit button
document.getElementById("search").addEventListener("click", event_handler);

// a function that will handle the page events
function event_handler(){
  var username = document.getElementById("username").value;
  var is_new_username = window.localStorage.getItem(username);

  if (is_new_username == null) {
    // so user name is not in local storage
    fetch(`https://api.github.com/users/${username}`)
      .then(async (data) => {
          // for network errors
        if (data.status != 404) {
          var response = await data.json();
          // handle \r\n in bio
          if (response.bio) {
            var userBio = response.bio.replace(/\n/g, "<br />");
          }
          else 
          {
            var userBio = "";
          }
          returnData(response.name, response.location, response.blog, response.avatar_url)

          // save user information in local host for next requests
          window.localStorage.setItem(username, JSON.stringify(response));
        } else {
          returnData("User not found!!", "", "", "", "")
        }
      })

      .catch((err) => {
        console.log(err);
      });

  } else {
      // username information is already in local host
    var response = window.localStorage.getItem(username);
    response = JSON.parse(response)
    returnData(response.name, response.location, response.blog, response.avatar_url, response.bio)

  }
}
// a function to return and fill informations 
function returnData(user_name, user_location, user_blog, user_prof_img, bioValue) {
  var return_name = document.getElementById("name");
  var return_blog = document.getElementById("blog");
  var return_avatar = document.getElementById("avatar");
  var return_location = document.getElementById("location");
  var return_bio = document.getElementById("bio");
  
  // set user bio and check if it's empty or not
  if (bioValue) {
    var userBio = bioValue.replace(/\n/g, "<br />");
  }
  else {
    var userBio = "";
  }

  noProfImg = false
  // check if user has not profile image
  if ( user_prof_img == "" )
    noProfImg = true


  // set values in html response elements
  return_avatar.setAttribute("src", user_prof_img);
  return_avatar.hidden = noProfImg;
  return_name.innerHTML = user_name;
  return_location.innerHTML = user_location;
  return_blog.innerHTML = user_blog;
  return_blog.setAttribute("href", user_blog);
  if (userBio){
    return_bio.innerHTML = 'bio: "'+userBio+'"';
  }else{
    return_bio.innerHTML = userBio
  }
}
