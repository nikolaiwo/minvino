import re
import scrapy
import json
from minvino_scraper.items import WineItem


class DnSmakSpider(scrapy.Spider):
    name = "dnSmak"

    def start_requests(self):
        urls = [
            'https://www.dn.no/sok/api/wine/search?p=1',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        data = json.loads(response.text)

        if data["components"] != []:
            for wine in data["components"]:
                try:
                    taste_date = wine["fields"]["test_date"]["value"]
                    taste_note = wine["fields"]["taste_notes"]["value"]
                    points = wine["fields"]["score"]["value"]

                    article_number = wine["fields"]["product_id"]["value"]
                    url = wine["canonical_url"]
                    yield WineItem(vinmonopoletProductId=article_number,
                          points=points,
                          link=url,
                          tasteNote=taste_note,
                          tasteDate=taste_date)
                except:
                    continue
                yield WineItem(vinmonopoletProductId=article_number,
                          points=points,
                          link=url,
                          tasteNote=taste_note,
                          tasteDate=taste_date)
            url, page = response.url.split("?p=")
            next_url = f"{url}?p={int(page)+1}"
            yield response.follow(next_url, self.parse)

