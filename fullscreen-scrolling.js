/*! fullscreen-scrolling v0.0.0 - MIT license */

;(function (global) { function moduleDefinition(/*dependency*/) {

// ---------------------------------------------------------------------------

'use strict';

/**
 * @param {}
 * @return {}
 * @api public
 */

function FullscreenScrolling(contextSelector, config) {
  this.context = document.querySelector(contextSelector);
  this.config = config;
  this.index = 0;
  this.lastScroll = 0;
  this.isTransitioning = false;
  this.sections = this.context.children;
  this.sections[this.index].classList.add('actived');
  
  this.setupCSS();
  this.setupListeners();
}

FullscreenScrolling.prototype = {
  setupListeners: function () {
    var scrollEvent;

    if (/Firefox/i.test(navigator.userAgent)) {
      scrollEvent = 'DOMMouseScroll';
    } else {
      scrollEvent = 'mousewheel';
    }

    this.context.addEventListener(scrollEvent, this.onScroll.bind(this));
    document.addEventListener('keyup', this.onKeypress.bind(this));
  },
  onScroll: function (event) {
    var direction, delta;

    if (this.isTransitioning === false) {
      delta = event.wheelDelta || (event.detail * -1);

      if (delta < 0) {
        direction = 'down';
      } else {
        direction = 'up';
      }

      this.triggerTransition(direction);
    }
  },
  onKeypress: function (event) {
    var direction;

    if (this.isTransitioning === false) {
      if (event.code === 'ArrowDown') {
        direction = 'down';
      } else if (event.code === 'ArrowUp') {
        direction = 'up';
      }

      this.triggerTransition(direction);
    }
  },
  triggerTransition: function (direction) {
    if (direction === 'down' && (this.index < this.sections.length - 1)) {
      this.isTransitioning = true;
      this.down();
    } else if (direction === 'up' && this.index > 0) {
      this.isTransitioning = true;
      this.up();
    }
  },
  setupCSS: function () {
    this.context.classList.add('fss-wrap');
    
    for (var i = 1, j = this.sections.length; i < j; i++) {
      this.sections[i].classList.add('down');
    }

    for (var i = 0, j = this.sections.length; i < j; i++) {
      this.sections[i].classList.add('fss-item');
    }
  },
  down: function () {
    var _this, leavingSection, enteringSection;

    _this = this;

    leavingSection = this.sections[this.index];
    leavingSection.classList.remove('actived');
    leavingSection.classList.add('up');
    leavingSection.classList.add('leavingUp');

    this.index += 1;

    enteringSection = this.sections[this.index];
    enteringSection.classList.add('actived');
    enteringSection.classList.add('enteringUp');
    enteringSection.classList.remove('down');

    setTimeout(function () {
      _this.completeTransitionDown(leavingSection, enteringSection);
    }, this.config.delay);
  },
  up: function () {
    var _this, leavingSection, enteringSection;

    _this = this;

    leavingSection = this.sections[this.index];
    leavingSection.classList.remove('actived');
    leavingSection.classList.add('down');
    leavingSection.classList.add('leavingDown');

    this.index -= 1;

    enteringSection = this.sections[this.index];
    enteringSection.classList.add('actived');
    enteringSection.classList.add('enteringDown');
    enteringSection.classList.remove('up');

    setTimeout(function () {
      _this.completeTransitionUp(leavingSection, enteringSection);
    }, this.config.delay);
  },
  completeTransitionDown: function (leavingSection, enteringSection) {
    leavingSection.classList.remove('leavingUp');
    enteringSection.classList.remove('enteringUp');
    this.isTransitioning = false;
  },
  completeTransitionUp: function (leavingSection, enteringSection) {
    leavingSection.classList.remove('leavingDown');
    enteringSection.classList.remove('enteringDown');
    this.isTransitioning = false;
  }
};

/**
 * Expose FullscreenScrolling
 */

return FullscreenScrolling;

// ---------------------------------------------------------------------------

} if (typeof exports === 'object') {
  // node export
  module.exports = moduleDefinition(/*require('dependency')*/);
} else if (typeof define === 'function' && define.amd) {
  // amd anonymous module registration
  define([/*'dependency'*/], moduleDefinition);
} else {
  // browser global
  global.FullscreenScrolling = moduleDefinition(/*global.dependency*/);
}}(this));
