import { ClientFunction } from 'testcafe';
import fs from 'fs';
import helper from './helper';
import config from '../config';

fixture `Example page`
  .page `${config.amazonPageLink}`;

//Script to be run on Amazon website to fetch asins/pricing/rating/image/product_position/
//for each category in a JSON file

let count = 1;
//var product_count = 0;
let dataItems = [];
//localStorage.setItem("data", dataItems);

// //Fetch the total number of pages
// const pages_count_text = document.getElementsByClassName("pagnDisabled");
//
// //Data is returned as string, parse the integer value from it
// const pages_count = parseInt(pages_count_text[0].innerText);


//getAsin function begins
async function getAsin() {
  const productArray = [];
  let productPosition = undefined;

  const pagesCount = await helper.getPagesCount();

  //Check if the count is less than the page count
  if (count <= pagesCount) {

    await helper.sleep(2000, async function() {
      //Get the parent ul element containing all the products
      // const resultsListContainer = getResultsListContainer();

      //Loop through all the child elements
      for (let i = 0; i < await helper.getResultsListContainerChildCount(); i++) {
        if (i < 24) {
          const [title, brand] = await helper.fetchTitleAndBrandName(i);

          const [rating_text, rating, number_of_reviews, reviews_link] =
            await helper.fetchRatingAndNumberOfReviews(i);

          productPosition = i+1 + ((count - 1) * 24);

          let product = {
            asin: await helper.fetchAsin(i),
            title: title,
            brand: brand,
            price_text: await helper.fetchPrice(i),
            rating_text: rating_text,
            rating: rating,
            number_of_reviews: number_of_reviews,
            reviews_link: reviews_link,
            image_link: await helper.fetchImage(i),
            product_position: productPosition,
            cod: await helper.fetchCod(i),
            prime: await helper.fetchPrime(i)
          };

          productArray.push(product);
        } //Condition to check for 24 children element ends
      }

      let interval = helper.getRandomArbitrary(300, 500);

      console.log("Number of products pushed to database: ", productArray.length);

      if (count < pagesCount) {
        if(productArray.length < 24) {
          console.log("Product count less than 24");
          await fetchClick(true);
        }

        if (productArray.length === 24) {

          productArray.forEach(function (item) {
            console.log("Pushed item: ", item.product_position);
          });

          dataItems = dataItems.concat(productArray);
          fs.writeFileSync(config.outputFile, JSON.stringify(dataItems, null, 2));
          console.log("Page :", count, " done\n");

          setTimeout(async function() {
            await helper.clickNextPage();
            await fetchClick(false);
          }, interval);
        }
      }

      if (count === pagesCount) {
        productArray.forEach(function (item) {
          console.log("Pushed item: ", item.product_position);
          //localStorage.setItem("items",dataItems);
        });
        dataItems = dataItems.concat(productArray);
        fs.writeFileSync(config.outputFile, JSON.stringify(dataItems, null, 2));

        console.log("Page :", count, " done\n");
        console.log("Finished fetching data");
        //Function to start the csv
        //downloadCSV({ filename: "stock-data.csv" });
        //console.save(dataItems);
      }
    });
  } //if count < pages_count ends
} //getAsin ends

async function fetchClick(isLessThen24Products) {
  const scrollTimeouts = [];
  scrollTimeouts[800] = 500;
  scrollTimeouts[1200] = 500;
  scrollTimeouts[1600] = 500;
  scrollTimeouts[2000] = 700;
  scrollTimeouts[2200] = 400;
  scrollTimeouts[2400] = 400;
  scrollTimeouts[3000] = 1000;


  for (let yPos in scrollTimeouts) {
    await helper.sleep(scrollTimeouts[yPos],
      async () => await helper.scrollTo(yPos)
    );
  }

  if (isLessThen24Products) {
    await helper.sleep(2000,
      async () => await helper.scrollTo(3500)
    );
  } else {
    await helper.sleep(500,
      async () => await helper.scrollTo(2600)
    );
  }

  await helper.sleep(1000,
    async () => {
      if (!isLessThen24Products) {
        count++;
      }
      await getAsin();
    }
  );
}

test('Amazon Products Scraper', async () => {
  await getAsin();
  await helper.sleep(80000 * await helper.getResultsListContainerChildCount(), () => {});
});
