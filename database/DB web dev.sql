-- use master
-- drop database TNCShop

create database TNCShop
go
use TNCShop
go
alter database TNCShop set TRUSTWORTHY ON
go
create table Category
(
	categoryID int identity(1,1) primary key,
	categoryName nvarchar(30) unique not null,
	createdAt datetime default CURRENT_TIMESTAMP not null
)
go
create table Brand
(
	brandID int identity(1,1) primary key,
	brandName nvarchar(30) unique not null,
	createdAt datetime default CURRENT_TIMESTAMP not null

)

go
create table Product
(
	productID int identity(1,1) primary key,
	stock int not null,
	name nvarchar (200) not null unique,
	favorite int not null check (favorite in (1,0)),
	categoryID int constraint FK_Product_cate references Category(categoryID) not null,
	price float not null,
	brandID int constraint FK_Product_brand references Brand(brandID) not null,
	image nvarchar(max),
	sale float ,
	description nvarchar(max),
	createdAt datetime default CURRENT_TIMESTAMP not null
)

go
create table Rating
(
	ratingID int identity(1,1) primary key,
	_5star int default 0,
	_4star int default 0,
	_3star int default 0,
	_2star int default 0,
	_1star int default 0,
	productID int constraint FK_Rating references Product(productID),
	createdAt datetime default CURRENT_TIMESTAMP not null
)
go
create table Users
(
	userID int identity(1,1) primary key,
	userName varchar(30) not null unique,
	password varchar(max) not null,
	auth int not null check (auth in (1,0)),
	--	1 - admin   0 -	user
	email varchar(100) unique not null ,
	createdAt datetime default CURRENT_TIMESTAMP not null
)
go

create table Subimg
(
	subimgID int identity(1,1) primary key,
	image varchar(max) not null,
	alt varchar(100) not null,
	productID int constraint FK_SrcImg references product(productID),
	createdAt datetime default CURRENT_TIMESTAMP not null
)
go

create table Cart
(
	cartID int identity(1,1) primary key,
	userID int constraint FK_Cart references Users(userID) unique,
	createdAt datetime default CURRENT_TIMESTAMP not null
)
create table Cart_Product
(
	cartID int ,
	productID int,
	amount int,
	primary key (cartID,productID),
	createdAt datetime default CURRENT_TIMESTAMP not null
)
go
alter table Cart_Product add  constraint FK_Cart_Product_Cart foreign key (cartID)  references Cart(cartID)
go
alter table Cart_Product add  constraint FK_Cart_Product_Product foreign key (productID)  references Product(productID)
go
create table Feature
(
	featureID int identity (1,1) primary key,
	feature nvarchar(max) not null,
	productID int constraint FK_Feature_Product  references Product(productID),
	createdAt datetime default CURRENT_TIMESTAMP not null
)
go

go
CREATE TRIGGER tr_product_delete
ON product
INSTEAD OF DELETE
AS
BEGIN
	DELETE FROM rating WHERE productID IN (SELECT deleted.productID
	FROM deleted);
	DELETE FROM feature WHERE productID IN (SELECT deleted.productID
	FROM deleted);
	DELETE FROM cart_product WHERE productID IN (SELECT deleted.productID
	FROM deleted);
	DELETE FROM subImg WHERE productID IN (SELECT deleted.productID
	FROM deleted);
	DELETE FROM product WHERE productID IN (SELECT deleted.productID
	FROM deleted);
END;

go

CREATE TRIGGER tr_user_delete
ON users
INSTEAD OF DELETE
AS
BEGIN
	DELETE FROM Cart WHERE userID IN (SELECT deleted.userID
	FROM deleted);
	DELETE FROM users WHERE userID IN (SELECT deleted.userID
	FROM deleted);
END;

go

CREATE TRIGGER tr_cart_delete
ON cart
INSTEAD OF DELETE
AS
BEGIN
	DELETE FROM Cart_Product WHERE cartID IN (SELECT deleted.cartID
	FROM deleted);
	DELETE FROM Cart WHERE cartID IN (SELECT deleted.cartID
	FROM deleted);
END;

go

CREATE FUNCTION [dbo].[fuConvertToUnsign1] ( @strInput NVARCHAR(4000) ) RETURNS NVARCHAR(4000) AS BEGIN
	IF @strInput IS NULL RETURN @strInput
	IF @strInput = '' RETURN @strInput
	DECLARE @RT NVARCHAR(4000)
	DECLARE @SIGN_CHARS NCHAR(136)
	DECLARE @UNSIGN_CHARS NCHAR (136)
	SET @SIGN_CHARS = N'ăâđêôơưàảãạáằẳẵặắầẩẫậấèẻẽẹéềểễệế ìỉĩịíòỏõọóồổỗộốờởỡợớùủũụúừửữựứỳỷỹỵý Ă ĐÊÔƠƯÀẢÃẠÁẰẲẴẶẮẦẨẪẬẤÈẺẼẸÉỀỂỄỆẾÌỈĨỊÍ ÒỎÕỌÓỒỔỖỘỐỜỞỠỢỚÙỦŨỤÚỪỬỮỰỨỲỶỸỴÝ' +NCHAR(272)+ NCHAR(208)
	SET @UNSIGN_CHARS = N'aadeoouaaaaaaaaaaaaaaaeeeeeeeeee iiiiiooooooooooooooouuuuuuuuuuyyyyy AADEOOUAAAAAAAAAAAAAAAEEEEEEEEEEIIIII OOOOOOOOOOOOOOOUUUUUUUUUUYYYYYDD'
	DECLARE @COUNTER int
	DECLARE @COUNTER1 int
	SET @COUNTER = 1
	WHILE (@COUNTER <=LEN(@strInput)) BEGIN
		SET @COUNTER1 = 1
		WHILE (@COUNTER1 <=LEN(@SIGN_CHARS)+1) BEGIN
			IF UNICODE(SUBSTRING(@SIGN_CHARS, @COUNTER1,1)) = UNICODE(SUBSTRING(@strInput,@COUNTER ,1) ) BEGIN
				IF @COUNTER=1 SET @strInput = SUBSTRING(@UNSIGN_CHARS, @COUNTER1,1) + SUBSTRING(@strInput, @COUNTER+1,LEN(@strInput)-1) ELSE SET @strInput = SUBSTRING(@strInput, 1, @COUNTER-1) +SUBSTRING(@UNSIGN_CHARS, @COUNTER1,1) + SUBSTRING(@strInput, @COUNTER+1,LEN(@strInput)- @COUNTER)
				BREAK
			END
			SET @COUNTER1 = @COUNTER1 +1
		END
		SET @COUNTER = @COUNTER +1
	END
	SET @strInput = replace(@strInput,' ','-')
	RETURN @strInput
END

go

-- select * from product where dbo.fuConvertToUnsign1(name)  like  N'%' + dbo.fuConvertToUnsign1(N'đồ') + '%'


select *
from Product
select *
from feature
select *
from rating
select *
from Subimg
select *
from Cart
select *
from Users
select *
from Cart_Product
select *
from category


