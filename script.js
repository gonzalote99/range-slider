'use strict';


class Range {
constructor(input, output, callback) {
  this.input = input;
  this.output = output;

  if(!this._isValid()) {
    return;
  }

  this._createDOMElements();

  this._initialCalculations();

  this._attachInitEvents();

  if(this.onInitialCallBack = callback) {
    this.onInitialCallBack();
  }
}

_mouseDown(e) {
  e.preventDefault();

this._mouseMove = this._mouseMove.bind(this);
this._mouseUp = this._mouseUp.bind(this);

document.addEventListener("mousemove", this._mouseMove);
document.addEventListener("mouseup", this._mouseUp);


this.oldValue = this.value;


return false;

}


_mouseMove(e) {
 e.preventDefault();

 let valueBeforeSlide = this.value;
 let newWidth = e.pageX - this.wrapper.getBoundingClientRect().left;

if(newWidth > this.wrapperWidth) {
  newWidth = wrapperWidth;
} else if (newWidth < 0) {
  newWidth = 0;
}

this.value = this._calculateValue(newWidth);

if(valueBeforeSlide !== this.value ) {
  this._updateValue(this.value);
}

if(this.onSlideCallback) {
   this.onSlideCallback();
}



}


_mouseUp(e) {
  document.removeEventListener("mousemove", this._mouseMove);
  document.removeEventListener("mouseup", this._mouseUp);

  if(this.onValueChangeCallBack && this.oldValue !== this.value ) {
    this.onValueChangeCallBack();
  }
  

  if(this.onSlideEndCallback) {
    this.onSlideEndCallback();
  }

}

_createDOMElements() {
this.wrapper = document.createElement("div");
this.wrapper.classList.add("range");


this.fill = document.createElement("span");
this.fill.classList.add("range-fill");

this.handle = document.createElement("span");
this.handle.classList.add("range-handle");

this.input.parentNode.insertBefore(this.wrapper, this.input);

this.wrapper.appendChild(this.fill);

this.wrapper.appendChild(this.handle);

this.wrapper.appendChild(this.input);

this.input.style.display = "none";


}

_attachInitEvents() {
  this.wrapper.addEventListener('click', (event) => {
    if(event.target === this.wrapper || event.target === this.fill) {
      this.value = this._calculateValue(event.offsetX);

      this._updateValue(this.value);

      if(this.onClickCallback) {
        this.onClickCallback();
      }

      if(this.onValueChangeCallBack) {
        this.onValueChangeCallBack();
      }
    }
  });

  this.handle.addEventListener('dragstart', () => false);
   
  this._mouseDown = this._mouseDown.bind(this);
  this.handle.addEventListener('mousedown', this._mouseDown);


}

_initialCalculations() {
  this.min = Number(this.input.getAttribute('min'));
  this.max = Number(this.input.getAttribute('max'));

  this.wrapperWidth = parseInt(window.getComputedStyle(this.wrapper).width, 10);


  this.step = Number(this.input.getAttribute('step'));
  this.breakpoints =  Math.ceil((this.max - this.min + 1) / this.step);
  this.stepWidth = this.wrapperWidth / (this.breakpoints - 1);


  this.value = this.input.getAttribute('value') ? Number(this.input.getAttribute('value')) : this.min;
   this.setValue(this.value);




}

 _isValid() {
  if(!this.input.getAttribute('min')) {
   console.warn("not min value");
   return false;
  }
  if(isNaN(Number(this.input.getAttribute('min')))) {
    console.warn("attribute must number");
    return false;
  }

  if(!this.input.getAttribute('max')) {
    console.warn("not max value");
    return false;
  }

  if(isNaN(Number(this.input.getAttribute('max')))) {
    console.warn("attribute must number");
    return false;
  }

  if(!this.input.getAttribute('step')){
  console.warn('attribute must step')
  return false;
  }
  if(isNaN(Number(this.input.getAttribute('step')))) {
    console.warn('attribute must number')
    return false;
  }

  if (Number(this.input.getAttribute('step')) !== parseInt(this.input.getAttribute('step'), 10)) {
    console.warn("attribute must integer");
    return false;
  }

  if(Number(this.input.getAttribute('step')) < 0) {
   console.warn("must > 0");
   return false;
  }

  return true;

 }

_calculateValue(newWidth) {
  let newValue, startWidth = -1, endWidth = this.stepWidth / 2;

  for(let i = 0; i < this.breakpoints; i++) {
    if (newWidth > startWidth && newWidth < endWidth) {
      newValue = this.min + i * this.step;
      break;
    }

    startWidth = endWidth;
    endWidth = endWidth + this.stepWidth;
  }


  newWidth = this._calculateWidth(newValue);

  this.fill.style.width = newWidth + "px";


  return newValue;



}

_calculateWidth(newValue) {
  return (Math.abs(newValue - this.min) / this.step) * this.stepWidth;


}

_updateValue(newValue) {
  this.input.setAttribute('value', newValue);


  if(this.output instanceof Array) {
    for (let i = 0; i < this.output.length; i++) {
      this.output[i].textContent = newValue; 
    }
  } else {
    if(this.output) {
      this.output.textContent = newValue;
    }
  }
}

setValue(newVale) {
  if(isNaN(Number(newVale))) {
    confirm.warn("vale must number");
    return;
  }

  newVale = Number(newVale);

  if(newVale < this.min || newVale > this.max) {
    console.warn("out bounds");
    return;
  }

  if((newVale - this.min) % this.step !== 0) {
    console.warn("not parameters");
    return;
  }

  this.fill.style.width = this._calculateWidth(newVale) + "px";


  this.value = newVale;

  this._updateValue(newVale);



};
getValue() {
  return this.value;
}

onClick(callback) {
  this.onClickCallback = callback;
}

onSlide(callback) {
  this.onSlideCallback = callback;
}

onValueChange(callback) {
  this.onValueChangeCallBack = callback;
}


onSlideEnd(callback) {
  this.onSlideEndCallback = callback;
}

}