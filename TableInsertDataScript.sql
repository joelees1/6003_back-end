/*
This script is used to insert data into the tables for the database in the case of a fresh install or if the db is lost.
create a database called 6003_CW and run the TableGenerationScript.sql to generate the tables needed for the API to work.
then run this script to populate the tables with data.
*/

/*
to add users it might be easier to use the API to add users as the password is hashed and salted before being added to the database.
following registering a few users, you can use the following script to edit the role of a user to admin for testing purposes.
*/

/*
UPDATE users
SET role = 'admin'
WHERE id = 1;
*/

/*
to add products it might be easier as well to use the API to add products as the image is stored in the database as a blob.
*/

/*
to add addresses and orders just add them from the SPA
*/

USE `6003_CW`;

-- insert art categories
insert into categories (name, description) values 
('Painting', 'Painting is the practice of applying paint, pigment, color or other medium to a solid surface.'),
('Sculpture', 'Sculpture is the branch of the visual arts that operates in three dimensions.'),
('Drawing', 'Drawing is a form of visual art in which a person uses various drawing instruments to mark paper or another two-dimensional medium.'),
('Photography', 'Photography is the art, application, and practice of creating durable images by recording light, either electronically by means of an image sensor, or chemically by means of a light-sensitive material such as photographic film.'); 

