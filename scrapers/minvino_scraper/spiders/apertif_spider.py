import re
import scrapy
from minvino_scraper.items import WineItem


class ApertifSpider(scrapy.Spider):
    name = "apertif"

    def start_requests(self):
        urls = [
            'https://www.aperitif.no/pollisten/vin',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for product in response.css('.item.item-product'):
            link = product.css('a.item-link::attr(href)').get()
            yield response.follow(link, self.parse_item)

        selected = response.css('.pagination.clearfix .selected').css('a::attr(href)').get()
        next_link = response.css('.pagination.clearfix').css('a::attr(href)').getall()[-1]
        if next_link != selected:
            yield response.follow(next_link, self.parse)

    def parse_item(self, response):
        points = response.css('.product-top .rating-points::text').get()
        for product_detail in response.css('.product-basic-details span').getall():
            if "Varenummer" in product_detail:
                match = re.search(r'<span>\s*(\d*)\s*<\/span>', product_detail)
                if match is not None:
                    article_number = match.group(1)
                else:
                    article_number =  None
        taste_date = response.css('.product-summary').css('time::attr(datetime)').get()
        taste_note = response.css('.product-summary').css('.conclusion::text').get()
        yield WineItem(vinmonopoletProductId=article_number,
                          points=points,
                          link=response.url,
                          tasteNote=taste_note,
                          tasteDate=taste_date)

