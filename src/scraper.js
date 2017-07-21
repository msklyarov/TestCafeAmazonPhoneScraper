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
          await fetchClick(true);
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
              await fetchClick(false);
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

async function fetchClick(isLessThen24Products) {
  const scrollTimeouts = [];
  scrollTimeouts[800] = 200;
  scrollTimeouts[1200] = 200;
  scrollTimeouts[1600] = 300;
  scrollTimeouts[2000] = 100;
  scrollTimeouts[2200] = 200;
  scrollTimeouts[2400] = 100;
  scrollTimeouts[2600] = 100;
  scrollTimeouts[3000] = 300;

  if (isLessThen24Products) {
    scrollTimeouts[3500] = 200;
  }

  for (let yPos in scrollTimeouts) {
    await helper.sleep(scrollTimeouts[yPos],
      async () => await helper.scrollTo(yPos)
    );
  }

  await helper.sleep(300,
    async () => {
      if (!isLessThen24Products) {
        await helper.clickNextPage();
        count++;
      }
      await getAsin();
    }
  );
}

test('Amazon Products Scraper', async () => {
  pagesCount = await helper.getPagesCount();
  await getAsin();
});
