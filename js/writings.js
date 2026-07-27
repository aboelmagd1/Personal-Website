/* Writings Posts Filter, Interactive Add/Edit/Delete & Copy HTML Logic */

document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.writings-filter-btn');
    const postsFeed = document.querySelector('.posts-feed');
    const isAr = document.documentElement.lang === 'ar';

    let editingPostId = null;
    let editingElement = null;

    // Toast notification for copying HTML
    const showToast = (message) => {
        let toast = document.getElementById('copyToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'copyToast';
            toast.className = 'copy-toast';
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // Helper to generate clean HTML for copying
    const getCleanPostHTML = (category, title, date, contentText, author) => {
        const categoryTag = category === 'prose' ? (isAr ? 'نثر' : 'نثر (Prose)') : (isAr ? 'زجل' : 'زجل (Zajal)');
        let bodyContent = '';

        if (category === 'zajal') {
            const lines = contentText.split('\n').map(l => l.trim()).filter(Boolean).join('<br>\n                            ');
            bodyContent = `<div class="poem-verses">\n                            ${lines}\n                        </div>`;
        } else {
            const paragraphs = contentText.split('\n').map(p => p.trim()).filter(Boolean).map(p => `<p>${p}</p>`).join('\n                        ');
            bodyContent = paragraphs;
        }

        const authorStr = author || (isAr ? 'بقلم محمود أبو المجد' : 'By Mahmoud Aboelmagd');
        const titleStr = title ? `<h3 class="post-title">${title}</h3>\n    ` : '';

        return `<!-- Post -->
<article class="post-card reveal" data-category="${category}">
    <div class="post-header">
        <span class="post-category-tag">${categoryTag}</span>
        <span class="post-date">${date}</span>
    </div>
    ${titleStr}<div class="post-body">
        ${bodyContent}
    </div>
    <div class="post-footer">
        <span class="post-author">${authorStr}</span>
    </div>
</article>`;
    };

    const copyPostHTML = (category, title, date, contentText, author) => {
        const htmlCode = getCleanPostHTML(category, title, date, contentText, author);
        navigator.clipboard.writeText(htmlCode).then(() => {
            showToast(isAr ? 'تم نسخ كود HTML للحافظة بنجاح!' : 'HTML Code Copied to Clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = htmlCode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast(isAr ? 'تم نسخ كود HTML للحافظة بنجاح!' : 'HTML Code Copied to Clipboard!');
        });
    };

    // 1. Load Custom Posts from LocalStorage
    const getStoredPosts = () => {
        try {
            return JSON.parse(localStorage.getItem('my_custom_posts')) || [];
        } catch (e) {
            return [];
        }
    };

    const saveStoredPosts = (posts) => {
        localStorage.setItem('my_custom_posts', JSON.stringify(posts));
    };

    const extractTextContent = (postBodyElement) => {
        if (!postBodyElement) return '';
        const poemVerses = postBodyElement.querySelector('.poem-verses');
        if (poemVerses) {
            return poemVerses.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        }
        const paragraphs = postBodyElement.querySelectorAll('p');
        if (paragraphs.length > 0) {
            return Array.from(paragraphs).map(p => p.innerText.trim()).join('\n\n');
        }
        return postBodyElement.innerText.trim();
    };

    const updatePostDOM = (article, post) => {
        article.setAttribute('data-category', post.category);
        if (post.id) article.setAttribute('data-custom-id', post.id);

        const categoryTagText = post.categoryLabel || (post.category === 'prose' ? (isAr ? 'نثر' : 'نثر (Prose)') : (isAr ? 'زجل' : 'زجل (Zajal)'));

        let bodyHTML = '';
        if (post.category === 'zajal') {
            const formattedVerses = post.content.split('\n').map(line => line.trim()).filter(Boolean).join('<br>');
            bodyHTML = `<div class="poem-verses">${formattedVerses}</div>`;
        } else {
            const formattedParagraphs = post.content.split('\n').map(p => p.trim()).filter(Boolean).map(p => `<p>${p}</p>`).join('');
            bodyHTML = formattedParagraphs;
        }

        const authorText = post.author || (isAr ? 'بقلم محمود أبو المجد' : 'By Mahmoud Aboelmagd');

        const titleHTML = post.title ? `<h3 class="post-title">${post.title}</h3>` : '';

        article.innerHTML = `
            <div class="post-header">
                <span class="post-category-tag">${categoryTagText}</span>
                <span class="post-date">${post.date}</span>
            </div>
            ${titleHTML}
            <div class="post-body">
                ${bodyHTML}
            </div>
            <div class="post-footer">
                <span class="post-author">${authorText}</span>
                <div class="post-actions">
                    <button class="btn-copy-post">${isAr ? 'نسخ الكود' : 'Copy HTML'}</button>
                    <button class="btn-edit-post">${isAr ? 'تعديل' : 'Edit'}</button>
                    <button class="btn-delete-post">${isAr ? 'حذف' : 'Delete'}</button>
                </div>
            </div>
        `;

        // Attach action handlers
        const copyBtn = article.querySelector('.btn-copy-post');
        const editBtn = article.querySelector('.btn-edit-post');
        const deleteBtn = article.querySelector('.btn-delete-post');

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                copyPostHTML(post.category, post.title, post.date, post.content, post.author);
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                openEditModal(article, post);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deletePost(post.id, article);
            });
        }
    };

    const renderSinglePost = (post, prepend = false) => {
        if (!postsFeed) return;
        const article = document.createElement('article');
        article.className = 'post-card reveal active';
        updatePostDOM(article, post);

        if (prepend) {
            postsFeed.insertBefore(article, postsFeed.firstChild);
        } else {
            postsFeed.appendChild(article);
        }
    };

    const deletePost = (id, element) => {
        if (id) {
            let posts = getStoredPosts();
            posts = posts.filter(p => p.id !== id);
            saveStoredPosts(posts);
        }
        element.remove();
    };

    // Initialize dataset if posts-feed is empty or has placeholder posts
    const initPostsFeed = () => {
        if (!postsFeed) return;

        // Render dataset items if available
        if (window.ALL_POSTS_DATA && window.ALL_POSTS_DATA.length > 0) {
            postsFeed.innerHTML = '';
            window.ALL_POSTS_DATA.forEach(postItem => {
                renderSinglePost(postItem, false);
            });
        }

        // Prepend stored custom posts from LocalStorage
        const storedPosts = getStoredPosts();
        storedPosts.reverse().forEach(post => renderSinglePost(post, true));
    };

    initPostsFeed();

    // 2. Filter Button Listener
    const filterPosts = () => {
        const activeBtn = document.querySelector('.writings-filter-btn.active');
        if (!activeBtn) return;
        const selectedFilter = activeBtn.getAttribute('data-filter');
        const allPosts = document.querySelectorAll('.post-card');

        allPosts.forEach(card => {
            const category = card.getAttribute('data-category');
            if (selectedFilter === 'all' || category === selectedFilter) {
                card.style.display = 'flex';
                card.classList.add('reveal', 'active');
            } else {
                card.style.display = 'none';
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPosts();
        });
    });

    // Scroll to Top & Scroll to Bottom Buttons Logic
    const scrollTopBtn = document.getElementById('scrollToTopBtn');
    const scrollBottomBtn = document.getElementById('scrollToBottomBtn');

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    // 3. Add / Edit Post Modal Handling
    const openAddPostBtns = document.querySelectorAll('#openAddPostBtn, #openAddPostBtnNav');
    const addPostModal = document.getElementById('addPostModal');
    const closeAddPostBtn = document.getElementById('closeAddPostBtn');
    const addPostForm = document.getElementById('addPostForm');
    const modalHeading = addPostModal ? addPostModal.querySelector('h3') : null;
    const submitBtn = addPostForm ? addPostForm.querySelector('button[type="submit"]') : null;

    const resetModalForm = () => {
        editingPostId = null;
        editingElement = null;
        if (addPostForm) addPostForm.reset();
        if (modalHeading) modalHeading.innerText = isAr ? '+ إضافة منشور جديد' : '+ Add New Writing / Post';
        if (submitBtn) submitBtn.innerText = isAr ? 'نشر المنشور' : 'Publish Post';
    };

    const openEditModal = (article, post) => {
        editingPostId = post.id || article.getAttribute('data-custom-id');
        editingElement = article;

        document.getElementById('postCategory').value = post.category || article.getAttribute('data-category') || 'prose';
        document.getElementById('postTitleInput').value = post.title || article.querySelector('.post-title')?.innerText || '';
        document.getElementById('postDateInput').value = post.date || article.querySelector('.post-date')?.innerText || '';
        document.getElementById('postContentInput').value = post.content || extractTextContent(article.querySelector('.post-body'));

        if (modalHeading) modalHeading.innerText = isAr ? 'تعديل المنشور' : 'Edit Post';
        if (submitBtn) submitBtn.innerText = isAr ? 'تحديث المنشور' : 'Update Post';

        if (addPostModal) {
            addPostModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    openAddPostBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            resetModalForm();
            if (addPostModal) {
                addPostModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeAddPostBtn && addPostModal) {
        closeAddPostBtn.addEventListener('click', () => {
            addPostModal.classList.remove('open');
            document.body.style.overflow = 'auto';
            resetModalForm();
        });
    }

    if (addPostModal) {
        addPostModal.addEventListener('click', (e) => {
            if (e.target === addPostModal) {
                addPostModal.classList.remove('open');
                document.body.style.overflow = 'auto';
                resetModalForm();
            }
        });
    }

    if (addPostForm) {
        addPostForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const category = document.getElementById('postCategory').value;
            const title = document.getElementById('postTitleInput').value.trim();
            const date = document.getElementById('postDateInput').value.trim() || (isAr ? 'أغسطس 2026' : 'August 2026');
            const content = document.getElementById('postContentInput').value.trim();

            if (!content) return;

            const postData = {
                id: editingPostId || ('post_' + Date.now()),
                category: category,
                categoryLabel: category === 'prose' ? (isAr ? 'نثر' : 'نثر (Prose)') : (isAr ? 'زجل' : 'زجل (Zajal)'),
                title: title,
                date: date,
                content: content,
                author: isAr ? 'بقلم محمود أبو المجد' : 'By Mahmoud Aboelmagd'
            };

            if (editingElement) {
                // Updating an existing post
                updatePostDOM(editingElement, postData);

                if (editingPostId) {
                    let posts = getStoredPosts();
                    const index = posts.findIndex(p => p.id === editingPostId);
                    if (index !== -1) {
                        posts[index] = postData;
                    } else {
                        posts.push(postData);
                    }
                    saveStoredPosts(posts);
                }
            } else {
                // Creating a new post
                const posts = getStoredPosts();
                posts.push(postData);
                saveStoredPosts(posts);
                renderSinglePost(postData, true);
            }

            filterPosts();
            resetModalForm();

            addPostModal.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    }
});
