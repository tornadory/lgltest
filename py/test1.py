#coding:utf-8
import urllib2
from BeautifulSoup import BeautifulSoup
import re
import MySQLdb
url = 'http://jianli.58.com/resume/91655325401100'
content = urllib2.urlopen(url).read()
soup = BeautifulSoup(content)
basedata = str(soup.findAll('li',attrs={'class':'item'}))
basedata = re.findall(r'(?<=class="item">).*?(?=</li>)',basedata)
ID = str(soup.findAll('script',attrs={'type':'text/javascript'}))
ID = re.findall(r'(?<=global.ids = ").*?(?=";)',ID)
ID = ID[0].decode('utf-8').encode('utf-8')
name = basedata[0].decode('utf-8').encode('utf-8')
sex = basedata[1].decode('utf-8').encode('utf-8')
age = basedata[2].decode('utf-8').encode('utf-8')
experience = basedata[3].decode('utf-8').encode('utf-8')
education = basedata[4].decode('utf-8').encode('utf-8')
pay = str(soup.findAll('dd',attrs={None:None}))
pay = re.findall(r'(?<=<dd>)\d+.*?(?=</dd>)',pay)
pay = pay[0].decode('utf-8').encode('utf-8')
expectdata = str(soup.findAll('dd',attrs={None:None}))
expectdata = re.findall(r'''(?<=["']>)[^<].*?(?=</a></dd>)''',expectdata)
ad = expectdata[0].decode('utf-8').encode('utf-8')
job = expectdata[1].decode('utf-8').encode('utf-8')
job_experience = str(soup.findAll('div',attrs={'class':'employed'}))
job_experience = re.findall(r'(?<=>)[^<].*?(?=<)',job_experience)
job_experience = ''.join(job_experience).decode('utf-8').encode('utf-8')
education_experience = str(soup.findAll('dd',attrs={None:None}))
education_experience = re.findall(r'(?<=<dd><p>).*\n.*\n?.*',education_experience)
education_experience = ''.join(education_experience).decode('utf-8').encode('utf-8')
conn = MySQLdb.Connect(
            host = '127.0.0.1',
            port = 3306,user = 'root',
            passwd = 'XXXXX',
            db = 'XXXX',
            charset = 'utf8')
cursor = conn.cursor()
sql_insert = "insert into resume(ID, name,sex,age,experience,education,pay,ad,job,job_experience,education_experience)\
values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
try:
    cursor.execute(sql_insert, (ID, name,sex,age,experience,education,pay,ad,job,job_experience,education_experience))
    conn.commit()
except Exception as e:
    print e
    conn.rollback()
finally:
    cursor.close()
    conn.close()
