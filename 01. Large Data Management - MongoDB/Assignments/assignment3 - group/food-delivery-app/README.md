# Presentation

[Slides](https://www.canva.com/design/DAGcKtvxI04/FdgGpluN9OFYzxWiT6fQyA/view?utm_content=DAGcKtvxI04&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hede7266a08)

# Chạy dự án

## Khởi tạo dự án bằng nodejs:

```
mkdir food-delivery-app
cd food-delivery-app
npm init -y
```

## Cài đặt thư viện

```
npm install mongodb readline
```

## Cấu trúc folder

```
food-delivery-app/
|-- node_modules/     (Folder chứa dependencies)
|-- .gitignore        (File cấu hình Git)
|-- app.js            (File chính của ứng dụng)
|-- package-lock.json (File lock cho dependencies)
|-- package.json      (File quản lý project và dependencies)
|-- README.md         (File tài liệu README cho project)
```

## Tạo database trong MongoDBCompass

### Kết nối tới localhost:27017

### Mở MongoDB shell và nhập

```
use food_delivery
```

## Chạy chương trình

```
node app.js
```
