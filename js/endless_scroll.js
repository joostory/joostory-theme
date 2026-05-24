class TumblrEndlessScroll {
  constructor(container, pager, currentPage) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.pager = typeof pager === 'string' ? document.querySelector(pager) : pager;
    this.currentPage = currentPage;
    this.noMore = false;
    this.loadLock = false;
    this.pathPrefix = this._makePathPrefix();

    this.init();
  }

  _makePathPrefix() {
    const prefix = window.location.pathname.split("/page/")[0];
    return prefix === "/" || prefix === "" ? "" : prefix;
  }

  async _loadList() {
    if (this.noMore || this.loadLock) {
      return;
    }

    this.loadLock = true;

    try {
      const nextPage = this.currentPage + 1;
      const url = `${this.pathPrefix}/page/${nextPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to load page");
      }
      
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const posts = doc.querySelectorAll(".contents .post");

      if (posts.length === 0) {
        this.noMore = true;
        if (this.pager) this.pager.style.display = 'none';
      } else {
        posts.forEach(post => {
          this.container.appendChild(post);
          
          // 파싱 후 새로 주입된 포스트 내부에 NPF 요약 생성 스크립트 등
          // 인라인 스크립트가 있다면 복제하여 명시적으로 재실행
          const scripts = post.querySelectorAll("script");
          scripts.forEach(script => {
            const newScript = document.createElement("script");
            if (script.src) {
              newScript.src = script.src;
            } else {
              newScript.textContent = script.textContent;
            }
            script.parentNode.replaceChild(newScript, script);
          });
        });
        
        this.currentPage++;
      }
    } catch (error) {
      console.error("Error during endless scroll load:", error);
      this.noMore = true;
      if (this.pager) this.pager.style.display = 'none';
    } finally {
      this.loadLock = false;
    }
  }

  init() {
    if (!this.container || !this.pager) {
      return;
    }

    // IntersectionObserver를 사용한 비동기 무한 스크롤 감지
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._loadList();
        }
      });
    }, {
      rootMargin: "200px" // 뷰포트 하단 200px 전에 미리 다음 페이지 로드 시작
    });

    this.observer.observe(this.pager);
  }
}

// 브라우저 전역 노출
window.TumblrEndlessScroll = TumblrEndlessScroll;
