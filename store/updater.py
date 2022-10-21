from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from .views import scrape_dollar


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(scrape_dollar, 'interval', minutes=60, max_instances=2)
    scheduler.start()