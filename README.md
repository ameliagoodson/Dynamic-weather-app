# homework6
This application is an interactive weather app featuring dynamic content, displaying the current and forecasted weather conditions including temperature, humidity, and wind speed. The current weather also displays the UV index.

The user's search history is saved via local storage to the sidebar, whereby the user can click on the previously searched city and load the weather information without having to type in again the name of their city. Upon page reload, the last searched-for city will be displayed, again via the use of local storage.

Bootstrap was used, to create the columns and rows. Further work could improve the responsiveness of the containers.  

# room for improvement / struggles
- While the value of the UVIndex updates upon pressing a previously-searched city, the colour does not update correctly - only when searching for a new city
- Responsiveness of five-day forecast and sidebar
- styling and web design in general 
- ideally remove the 12:00:00 component of the 5-day forecast, which represents 12pm. Assume I could probably use some sort of a splice or split function, but ran out of time and did not prioritise this

# lessons learnt
- Separate functions per single task executed: this avoids difficult when calling the function later but only wanting to execute part of the function
- location of variables: need to do further research on impact of global vs local variables and impact e.g. can't call a variable that was created inside a function, in another function (a local variable)
- discovered that local storage cannot accept/store an array properly! This is why the stringify function is necessary
- calling APIs and displaying the output remains much easier (not not easy) for me than other functions and concepts that I'm still trying to understand or don't know exist e.g.  understanding the interaction of the different functions and why some remain undefined, lexical scope, global variables, parse and stringify functions, how to structure code etc.  


# screenshot of application
![image](https://user-images.githubusercontent.com/60428536/77751392-b6e47280-7079-11ea-8f95-5cb9c1f053a2.png)

# link to Github repo and deployed site
https://github.com/ameliagoodson/homework6
https://ameliagoodson.github.io/homework6/

