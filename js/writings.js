/* Writings Posts Filter, Search, Pagination & Interactive Add/Edit/Delete Logic */

document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.writings-filter-btn');
    const postsFeed = document.querySelector('.posts-feed');
    const isAr = document.documentElement.lang === 'ar';

    const searchInput = document.getElementById('writingsSearchInput');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    let currentFilter = 'all';
    let searchQuery = '';
    let currentPage = 1;
    const PAGE_SIZE = 12;

    let editingPostId = null;
    let editingElement = null;

    // Toast notification
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

    // Helper to generate clean JS Object for all_posts_data.js
    const getCleanPostJSObject = (category, title, date, contentText, author, id) => {
        const categoryLabelAr = category === 'prose' ? 'نثر' : 'زجل';
        const categoryLabelEn = category === 'prose' ? 'نثر (Prose)' : 'زجل (Zajal)';
        const authorAr = author || (isAr ? 'بقلم محمود أبو المجد' : 'By Mahmoud Aboelmagd');
        const authorEn = 'By Mahmoud Aboelmagd';

        const postObj = {
            id: id || `custom_${Date.now()}`,
            category: category || 'prose',
            categoryLabelAr: categoryLabelAr,
            categoryLabelEn: categoryLabelEn,
            title: title || '',
            date: date || '',
            content: contentText || '',
            authorAr: authorAr,
            authorEn: authorEn
        };

        return JSON.stringify(postObj, null, 2) + ',';
    };

    const copyPostJS = (category, title, date, contentText, author, id) => {
        const jsCode = getCleanPostJSObject(category, title, date, contentText, author, id);
        navigator.clipboard.writeText(jsCode).then(() => {
            showToast(isAr ? 'تم نسخ كود المنشور (JS) للحافظة بنجاح!' : 'Post JS Code Copied to Clipboard!');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = jsCode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast(isAr ? 'تم نسخ كود المنشور (JS) للحافظة بنجاح!' : 'Post JS Code Copied to Clipboard!');
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
                    <button class="btn-copy-text-post">${isAr ? 'نسخ النص' : 'Copy Text'}</button>
                    <button class="btn-copy-post">${isAr ? 'نسخ الكود' : 'Copy JS Code'}</button>
                    <button class="btn-edit-post">${isAr ? 'تعديل' : 'Edit'}</button>
                    <button class="btn-delete-post">${isAr ? 'حذف' : 'Delete'}</button>
                </div>
            </div>
        `;

        // Attach action handlers
        const copyTextBtn = article.querySelector('.btn-copy-text-post');
        const copyBtn = article.querySelector('.btn-copy-post');
        const editBtn = article.querySelector('.btn-edit-post');
        const deleteBtn = article.querySelector('.btn-delete-post');

        if (copyTextBtn) {
            copyTextBtn.addEventListener('click', () => {
                const textContent = post.content || extractTextContent(article.querySelector('.post-body'));
                const authorStr = post.author || (isAr ? 'بقلم محمود أبو المجد' : 'By Mahmoud Aboelmagd');
                const titleStr = post.title ? `${post.title}\n\n` : '';
                const siteUrl = isAr 
                    ? 'https://aboelmagd1.github.io/Personal-Website/know-me-more-ar.html' 
                    : 'https://aboelmagd1.github.io/Personal-Website/know-me-more.html';

                const readMoreText = isAr ? '📖 اقرأ المزيد على موقعي:' : '📖 Read more on my website:';
                const fullCopiedText = `${titleStr}${textContent}\n\n— ${authorStr}\n\n${readMoreText}\n${siteUrl}`;

                navigator.clipboard.writeText(fullCopiedText).then(() => {
                    showToast(isAr ? 'تم نسخ النص ورابط الموقع بنجاح!' : 'Post Text & Website Link Copied!');
                }).catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = fullCopiedText;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    showToast(isAr ? 'تم نسخ النص ورابط الموقع بنجاح!' : 'Post Text & Website Link Copied!');
                });
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                copyPostJS(post.category, post.title, post.date, post.content, post.author, post.id);
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

    // 2. Filter & Search Dataset Logic
    const getFilteredPostsList = () => {
        const storedPosts = getStoredPosts().slice().reverse();
        const basePosts = window.ALL_POSTS_DATA || [];
        const combined = [...storedPosts, ...basePosts];

        return combined.filter(post => {
            // Category Filter
            if (currentFilter !== 'all' && post.category !== currentFilter) {
                return false;
            }
            // Search Query Filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase().trim();
                const contentText = (post.content || '').toLowerCase();
                const titleText = (post.title || '').toLowerCase();
                const dateText = (post.date || '').toLowerCase();
                if (!contentText.includes(q) && !titleText.includes(q) && !dateText.includes(q)) {
                    return false;
                }
            }
            return true;
        });
    };

    const renderFeed = (resetPage = false) => {
        if (!postsFeed) return;
        if (resetPage) currentPage = 1;

        const filtered = getFilteredPostsList();
        const visibleCount = currentPage * PAGE_SIZE;
        const visiblePosts = filtered.slice(0, visibleCount);

        postsFeed.innerHTML = '';

        if (visiblePosts.length === 0) {
            postsFeed.innerHTML = `<p style="text-align: center; padding: 40px; color: var(--text-secondary); font-size: 1.1rem;">
                ${isAr ? 'لم يتم العثور على منشورات تطابق كلمات البحث.' : 'No writings found matching your search.'}
            </p>`;
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            return;
        }

        visiblePosts.forEach(post => {
            renderSinglePost(post, false);
        });

        if (loadMoreContainer) {
            if (visibleCount < filtered.length) {
                loadMoreContainer.style.display = 'block';
                loadMoreContainer.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.95rem; font-weight: 500;">⬇️ ${isAr ? 'جاري تحميل المزيد من المنشورات تلقائياً...' : 'Loading more posts automatically...'}</p>`;
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }
    };

    // Initial feed render
    renderFeed(true);

    // Filter Buttons Listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            renderFeed(true);
        });
    });

    // Search Input Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderFeed(true);
        });
    }

    // Automatic Infinite Scroll Logic (IntersectionObserver + Scroll Event)
    let isLoadingMore = false;
    const loadNextBatch = () => {
        if (isLoadingMore) return;
        const filtered = getFilteredPostsList();
        if (currentPage * PAGE_SIZE < filtered.length) {
            isLoadingMore = true;
            currentPage++;
            renderFeed(false);
            setTimeout(() => { isLoadingMore = false; }, 300);
        }
    };

    if (loadMoreContainer && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && loadMoreContainer.style.display !== 'none') {
                    loadNextBatch();
                }
            });
        }, { rootMargin: '300px' });

        observer.observe(loadMoreContainer);
    }

    window.addEventListener('scroll', () => {
        if (loadMoreContainer && loadMoreContainer.style.display !== 'none') {
            const rect = loadMoreContainer.getBoundingClientRect();
            if (rect.top <= window.innerHeight + 400) {
                loadNextBatch();
            }
        }
    });

    // Load More Button Manual Click Fallback
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadNextBatch();
        });
    }

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
                const posts = getStoredPosts();
                posts.push(postData);
                saveStoredPosts(posts);
            }

            renderFeed(true);
            resetModalForm();

            addPostModal.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    }
});
