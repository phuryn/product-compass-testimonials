-- Insert branding data
insert into public.branding (key, value)
values 
    ('header_title', 'Would you like to recommend my content?'),
    ('header_subtitle', 'Hi there! I would be thrilled if you could take a moment to leave me a testimonial.'),
    ('primary_color', '#1f883d'),
    ('footer_text', 'My newsletter'),
    ('footer_url', 'https://www.google.com'),
    ('show_tags_on_index', 'true');

-- Insert tags (products to recommend)
insert into public.tags (name)
values 
    ('Newsletter'),
    ('My First Course'),
    ('My Second Course');
