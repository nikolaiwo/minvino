# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class WineItem(scrapy.Item):
    vinmonopoletProductId = scrapy.Field()
    points = scrapy.Field()
    link = scrapy.Field()
    tasteNote = scrapy.Field()
    tasteDate = scrapy.Field()
