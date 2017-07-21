import { ClientFunction } from 'testcafe';
import fs from 'fs';
import helper from './helper';
import config from '../config';

fixture `Example page`
  .page `${config.amazonPageLink}`;

//Script to be run on Amazon website to fetch asins/pricing/rating/image/product_position/
//for each category in a JSON file

let count = 1;
let dataItems = [];

let pagesCount;

async function getAsin() {
  console.log('Page count: ', count);

  const productArray = [];
  let productPosition = undefined;

  // Check if the count is less than the page count
  if (count <= pagesCount) {
    await helper.sleep(300, async () => {
      // Loop through all the child elements
      for (let i = 0; i < await helper.getResultsListContainerChildCount(); i++) {
        if (i < 24) {
          const [title, brand] = await helper.fetchTitleAndBrandName(i);

          const [ratingText, rating, numberOfReviews, reviewsLink] =
            await helper.fetchRatingAndNumberOfReviews(i);

          productPosition = i+1 + ((count - 1) * 24);

          let product = {
            asin: await helper.fetchAsin(i),
            title: title,
            brand: brand,
            price_text: await helper.fetchPrice(i),
            rating_text: ratingText,
            rating: rating,
            number_of_reviews: numberOfReviews,
            reviews_link: reviewsLink,
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
          await helper.fetchClick(true);
          await getAsin();
        }

        if (productArray.length === 24) {

          productArray.forEach(function (item) {
            console.log("Pushed item: ", item.product_position);
          });

          dataItems = dataItems.concat(productArray);
          fs.writeFileSync(config.outputFile, JSON.stringify(dataItems, null, 2));
          console.log("Page :", count, " done\n");

          await helper.sleep(interval,
            async () => {
              await helper.fetchClick(false);
              count++;
              await getAsin();
            }
          );
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
      }
    });
  } //if count < pages_count ends
} //getAsin ends

test('Amazon Products Scraper', async () => {
  pagesCount = await helper.getPagesCount();
  await getAsin();
});
