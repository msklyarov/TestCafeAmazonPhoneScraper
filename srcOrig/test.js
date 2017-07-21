//Script to be run on Amazon website to fetch asins/pricing/rating/image/product_position/ 
//for each category in a JSON file

var count = 1;
//var product_count = 0;
var data_items = [];
//localStorage.setItem("data", data_items);



//Fetch the total number of pages
var pages_count_text = document.getElementsByClassName("pagnDisabled");
//Data is returned as string, parse the integer value from it
var pages_count = parseInt(pages_count_text[0].innerText);

//getAsin function begins
function getAsin(){     
		   
	var product_array = [];
	var product_position = undefined;
		
	//Check if the count is less than the page count
	if(count<=pages_count)
	{		

		setTimeout(function(){

		//Get the parent ul element containing all the products
		var ul = document.getElementById('s-results-list-atf');			
		
		//Loop through all the child elements			
		for(var i=0;i<ul.children.length;i++)
		{
			if(i<24)
			{

				//Fetch ASIN
				var asin = ul.children[i].getAttribute("data-asin");
				// console.log("Fetched ASIN");

				
				//Fetch title & Brand name
				if(ul.children[i].getElementsByClassName("s-access-title")[0] !== undefined)
				{
					var title = ul.children[i].getElementsByClassName("s-access-title")[0].innerText;
					title = title.replace(/,/g,"");
					// console.log("Fetched title");

					if(ul.children[i].getElementsByClassName("s-access-title")[0].parentNode.parentNode.nextElementSibling !== null){
						var brand = ul.children[i].getElementsByClassName("s-access-title")[0].parentNode.parentNode.nextElementSibling.children[1].innerText;
						brand = brand.replace(/,/g,"");
					}

					else{
						var brand = "N/A";
					}
					
				}

				else
				{
					var title = "N/A";
					var brand = "N/A";
					// console.log("Title N/A");	
				}


				//Fetch price
				var price_text = "";

				//Check if the s-price class is used
				if(ul.children[i].getElementsByClassName("s-price")[0]!== undefined)
				{
					price_text = ul.children[i].getElementsByClassName("s-price")[0].innerText;
					price_text = price_text.replace(/,/g,"");
					price_text = parseFloat(price_text);
					// console.log("Fetched price");
				}


				else
				{
					//Check if price is mentioned other way
					if(ul.children[i].getElementsByClassName("a-color-price")[0]!== undefined)
					{

						price_text = ul.children[i].getElementsByClassName("a-color-price")[0].innerText;
						price_text = price_text.replace(/,/g,"");
						price_text = parseFloat(price_text);
						// console.log("Fetched different price");

					}

					//Set price as 0
					else
					{
						price_text = 0;
						// console.log("Product pricing not available");
					}


				}



				//Fetch rating
				if(ul.children[i].getElementsByClassName("a-icon-star")[0] !== undefined)
				{
					var rating_text = ul.children[i].getElementsByClassName("a-icon-star")[0].innerText;
					rating_text = rating_text.replace(/,/g,"");
					var rating = parseFloat(rating_text);
					// console.log("Fetched Rating");

					//Fetch number of reviews
					if(ul.children[i].getElementsByClassName("a-icon-star")[0].parentNode.parentNode.parentNode.nextElementSibling !== undefined)
					{

						var number_of_reviews = ul.children[i].getElementsByClassName("a-icon-star")[0].parentNode.parentNode.parentNode.nextElementSibling.innerText;
						number_of_reviews = number_of_reviews.replace(/,/g,"");

						var reviews_link = ul.children[i].getElementsByClassName("a-icon-star")[0].parentNode.parentNode.parentNode.nextElementSibling.getAttribute('href');
						// console.log("Fetched reviews and reviews_link");

					}
				}


				//Set reviews and rating as N/A
				else
				{
					var rating_text = "N/A";
					var rating = 0;
					// console.log("Rating N/A");
					var number_of_reviews = 0;
					var reviews_link = "N/A";
					// console.log("Number of reviews: 0");
				}



				//Fetch Image
				if(ul.children[i].getElementsByTagName("img")[0]!==undefined)
				{
					var image_link = ul.children[i].getElementsByTagName("img")[0].getAttribute('src');
					// console.log("Fetched Image");
				}

				//Set image as N/A
				else
				{
					var image_link = "N/A";
					// console.log("Image N/A")
				}

				product_position = i+1 + ((count - 1) * 24);

				//Fetch prime
				var prime = false;
				if(ul.children[i].getElementsByClassName("a-icon-prime").length > 0){
					prime = true;
				}

				else{
					prime = false;
				}


				//Fetch COD
				var cod = false;
				if(ul.children[i].getElementsByClassName("a-spacing-mini a-spacing-top-mini")[0]!== undefined){

					if(ul.children[i].getElementsByClassName("a-spacing-mini a-spacing-top-mini")[0].innerText.length > 0){
						cod = true;	
					}

					else{
						cod = false;
					}
					
				}

				else{
					cod = false;
				}

				
				var product = 
				{
					asin: asin,
					title: title,
					brand: brand,
					price_text: price_text,
					rating_text: rating_text,
					rating: rating,
					number_of_reviews: number_of_reviews,
					reviews_link: reviews_link,
					image_link: image_link,
					product_position: product_position,
					cod:cod,
					prime: prime
				}//product object ends
				
				product_array.push(product);


			}//Condition to check for 24 children element ends				

		}//Loop ends

		var interval = getRandomArbitrary(300,500);
		// console.log("Time interval is: ", interval);


		console.log("Number of products pushed to database: ", product_array.length);

		if(product_array.length<24 && count < pages_count)
		{
			console.log("Product count less than 24");
			setTimeout(function(){
				window.scrollTo(0,800);
			},500);

			setTimeout(function(){
				window.scrollTo(0,1200);
			},1000);

			setTimeout(function(){
				window.scrollTo(0,1600);
			},1500);
			setTimeout(function(){
				window.scrollTo(0,2000);
			},2200);

			setTimeout(function(){
				window.scrollTo(0,2200);
			},2600);

			setTimeout(function(){
				window.scrollTo(0,2400);
			},3000);
			setTimeout(function(){
				window.scrollTo(0,3000);
			},4000);
			setTimeout(function(){
				window.scrollTo(0,3500);
			},5000);
			setTimeout(function()
			{
			window.getAsin();
			}, 6000);


		}//if ends

		if(product_array.length === 24 && count < pages_count)
		{
			product_array.forEach(save_to_db_items);
			function save_to_db_items(item, index, array){
				console.log("Pushed item: ", item.product_position);
				data_items.push(item);
				//localStorage.setItem("items",data_items);
			}
			console.log("Page :", count, " done");
			console.log("\n");

			if(count<pages_count){
				setTimeout(function()
				{ 
					window.fetchclick();
				}, interval);	
			}
				
		}//if ends

		if(count === pages_count){

			product_array.forEach(save_to_db_items);
			function save_to_db_items(item, index, array){
				console.log("Pushed item: ", item.product_position);
				data_items.push(item);
				//localStorage.setItem("items",data_items);
			}
			console.log("Page :", count, " done");
			console.log("\n");
			console.log("Finished fetching data");
			//Function to start the csv
			//downloadCSV({ filename: "stock-data.csv" });
			//console.save(data_items);

		}


		function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
		}//getRandomArbitraryends


		}, 2000);


	}//if count < pages_count ends


}//getAsin ends




//fetchclick function
function fetchclick(){

	var nextpage = document.getElementById("pagnNextLink");
	nextpage.click();

	setTimeout(function(){
		window.scrollTo(0,800);
	},500);

	setTimeout(function(){
		window.scrollTo(0,1200);
	},1000);

	setTimeout(function(){
		window.scrollTo(0,1600);
	},1500);
	
	setTimeout(function(){
		window.scrollTo(0,2000);
	},2200);

	setTimeout(function(){
		window.scrollTo(0,2200);
	},2600);

	setTimeout(function(){
		window.scrollTo(0,2400);
	},3000);

	setTimeout(function(){
		window.scrollTo(0,2600);
	},3500);

	setTimeout(function(){
		window.scrollTo(0,3000);
	},4000);

	setTimeout(function(){
		count++;
		window.getAsin();
	}, 5500);
	
}









