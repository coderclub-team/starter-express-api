


// a route for products
import express, { NextFunction, Request, Response } from "express";
const router = express.Router();

function fullUrl(request: Request, key: string = "identities/user-identity.png") {
    let hostname = request.protocol + "://" + request.get("host");
    const fullPath = `${hostname}/${key}`;
    return fullPath;
}




router.get("/product_categories", (req:Request,res:Response,next:NextFunction)=>{
    const categories =[
        {
      
          "id": 1,
          "category_name": "COW MILK",
          "products": [
            {
              "img": "products/cow-milk-bottle.jpg",
              "name": "Cow Milk Pet Bottle-300ml",
              "price": 17.00
            },
            {
              "img": "products/cow-milk.jpg",
              "name": "Cow Milk -500ml",
              "price": 28.00
            },
            {
              "img": "products/cow-milk-bottle.jpg",
              "name": "Cow Milk Pet Bottle-500ml",
              "price": 31.00
            },
            {
              "img": "products/cow-milk.jpg",
              "name": "Cow Milk -1000ml",
              "price": 54.00
            }
      
          ]
        },
        {
      
          "id": 2,
          "category_name": "TONED MILK",
          "products": [
            {
              "img": "products/tm.jpg",
              "name": "Toned Milk-250ml",
              "price": 13.75
            },
            {
              "img": "products/tm.jpg",
              "name": "Toned Milk-500ml",
              "price": 27.00
            }
      
          ]
        },
        {
      
          "id": 3,
          "category_name": "STANDARDIZED MILK",
          "products": [
            {
              "img": "products/sm.jpg",
              "name": "STANDARDIZED MILK -mini",
              "price": 9.50
            },
            {
              "img": "products/sm.jpg",
              "name": "STANDARDIZED MILK -500ml",
              "price": 31.00
            },
            {
              "img": "products/sm.jpg",
              "name": "STANDARDIZED MILK -1000ml",
              "price": 62.00
            },
            {
              "img": "products/sm.jpg",
              "name": "STANDARDIZED MILK -300ml",
              "price": 300.00
            }
      
          ]
        },
        {
      
          "id": 4,
          "category_name": "FULL CREAM MILK",
          "products": [
            {
              "img": "products/fcm.jpg",
              "name": "Full Cream Milk-mini",
              "price": 9.50
            },
            {
              "img": "products/fcm.jpg",
              "name": "Full Cream Milk-200ml",
              "price": 16.00
            },
            {
              "img": "products/fcm.jpg",
              "name": "Full Cream Milk-500ml",
              "price": 35.00
            },
            {
              "img": "products/fcm.jpg",
              "name": "Full Cream Milk-1000ml",
              "price": 70.00
            },
            {
              "img": "products/fcm.jpg",
              "name": "Full Cream Milk-5000ml",
              "price": 340.00
            }
      
          ]
        },
        {
      
          "id": 5,
          "category_name": "CURD",
          "products": [
            {
              "img": "products/curd.jpg",
              "name": "Curd-140g",
              "price": 9.50
            },
            {
              "img": "products/curd.jpg",
              "name": "Curd-450g",
              "price": 34.00
            },
            {
              "img": "products/curd.jpg",
              "name": "Curd-1kg",
              "price": 70.00
            }
           
      
          ]
        },
        {
      
          "id": 6,
          "category_name": "CUP CURD",
          "products": [
            {
              "img": "products/cup-curd.jpg",
              "name": "Cup Curd-50g",
              "price": 6.00
            },
            {
              "img": "products/cup-curd.jpg",
              "name": "Cup Curd-100g",
              "price":10.00
            }
          ]
        },
        {
      
          "id": 7,
          "category_name": "BUTTER MILK" ,
           "products": [
            {
              "img": "products/cow-milk.jpg",
              "name": "Butter Milk-1800ml",
              "price": 15.00
            }
          ]
        },
        {
      
          "id": 8,
          "category_name": "TAMIL BUTTER",
          "products": [
           {
             "img": "products/butter/butter.jpg",
             "name": "Tamiln Butter-100g",
             "price": 65.00
           },
           {
            "img": "products/butter/butter.jpg",
            "name": "Tamiln Butter-200g",
            "price": 128.00
          },
          {
            "img": "products/butter/butter.jpg",
            "name": "Tamiln Butter-500g",
            "price": 283.00
          },
          {
           "img": "products/butter/butter.jpg",
           "name": "Tamiln Butter-1kg",
           "price": 560.00
         }
         ]
        },
        {
      
          "id": 9,
          "category_name": "TAMIL GHEE",
          "products": [
            {
              "img": "products/ghee/cow-ghee.jpg",
              "name": "Tamil Ghee-Mini Pouch",
              "price": 10.00
            },
            {
              "img": "products/ghee/cow-ghee.jpg",
              "name": "Tamil Ghee-50ml",
              "price": 48.00
            },
            {
              "img": "products/ghee/cow-ghee.jpg",
              "name": "Tamil Ghee-100ml",
              "price": 88.00
            },
            {
              "img": "products/ghee/cow-ghee.jpg",
              "name": "Tamil Ghee-200ml",
              "price": 116.00
            },
            {
              "img": "products/ghee/cow-ghee.jpg",
              "name": "Tamil Ghee-500ml",
              "price": 384.00
            },
            {
              "img": "products/ghee/cow-ghee.jpg",
              "name": "Tamil Ghee-1000ml",
              "price": 755.00
            }
          ]
        },
        {
      
          "id": 10,
          "category_name": "PANEER",
          "products": [
            {
              "img": "products/paneer/paneer.jpg",
              "name": "Paneer-200g",
              "price": 99.00
            },
            {
              "img": "products/paneer/paneer.jpg",
              "name": "Paneer-1kg",
              "price": 372.00
            }
          ]
        },
        {
      
          "id": 11,
          "category_name": "MILK KOVA",
          "products": [
            {
              "img": "products/sweets/palkova.jpg",
              "name": "Milk Kovva-100g",
              "price": 40.00
            },
            {
              "img": "products/sweets/palkova.jpg",
              "name": "Milk Kovva-250g",
              "price": 100.00
            },
            {
              "img": "products/sweets/palkova.jpg",
              "name": "Milk Kovva-500g",
              "price": 175.00
            }
      
          ]
        },
        {
      
          "id": 12,
          "category_name": "MILK BURFI",
          "products": [
            {
              "img": "products/sweets/burfi-box.jpg",
              "name": "Milk Burfi-250g",
              "price": 145.00
            },
            {
              "img": "products/sweets/burfi-box.jpg",
              "name": "Milk Burfi-500g",
              "price": 260.00
            }
          ]
        },
        {
      
          "id": 13,
          "category_name": "ORANGE BURST",
          "products": [
            {
              "img": "products/sweets/orange_burst.jpg",
              "name": "ORANGE BURST-250g",
              "price": 120.00
            },
            {
              "img": "products/sweets/orange_burst.jpg",
              "name": "ORANGE BURST-500g",
              "price": 240.00
            }
          ]
        },
        {
      
          "id": 14,
          "category_name": "STRABERRY PUNCH",
          "products": [
            {
              "img": "products/sweets/strawberry-punch.jpg",
              "name": "STRABERRY PUNCH-250g",
              "price": 120.00
            },
            {
              "img": "products/sweets/strawberry-punch.jpg",
              "name": "STRABERRY PUNCH-500g",
              "price": 240.00
            }
          ]
        },
        {
      
          "id": 15,
          "category_name": "CHOCKOVA",
          "products": [
            {
              "img": "products/sweets/chockova.jpg",
              "name": "CHOCKOVA-250g",
              "price": 155.00
            },
            {
              "img": "products/sweets/chockova.jpg",
              "name": "CHOCKOVA-500g",
              "price": 310.00
            }
          ]
        },
        {
      
          "id": 16,
          "category_name": "MILK DATES",
          "products": [
            {
              "img": "products/sweets/milky_dates.jpg",
              "name": "Tamiln Butter-250g",
              "price": 135.00
            },
            {
              "img": "products/sweets/milky_dates.jpg",
              "name": "Tamiln Butter-500g",
              "price": 270.00
            }
          ]
        },
        {
      
          "id":17,
          "category_name": "COMBO BOX",
          "products": [
            {
              "img": "products/sweets/combo.jpg",
              "name": "Combo-250g",
              "price": 140.00
            },
            {
              "img": "products/sweets/combo.jpg",
              "name": "Combo-500g",
              "price": 250.00
            }
          ]
        }
      ]
      

    categories.forEach((category:any)=>{
        category.products.forEach((product:any)=>{
            product.img = fullUrl(req,product.img) 
        })
    })

    res.status(200).json(categories);
});

export default router;


