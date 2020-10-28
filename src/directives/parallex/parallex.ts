import {Directive, ElementRef, Renderer} from '@angular/core';

@Directive({
  selector: '[parallex]',
  host:{
    '(ionScroll)':'onCntscroll($event)',
  }
})
export class ParallexDirective {
  header:any;
  main_cnt:any;
  ta:any;
  constructor(public el:ElementRef,public re:Renderer) {
  }
  ngOnInit() {
    let cnt=this.el.nativeElement.getElementsByClassName('scroll-content')[0];
    this.header=cnt.getElementsByClassName('bg')[0];
    this.main_cnt=cnt.getElementsByClassName('main-cnt')[0];

    this.re.setElementStyle(this.header,'webTransformOrigin','center bottom');
    this.re.setElementStyle(this.header,'background-size','cover');
    this.re.setElementStyle(this.main_cnt,'position','absolute');


  }
  onCntscroll(ev){
    ev.domWrite(()=>{
      this.update(ev);
    });
  }

  update(ev){
    if(ev.scrollTop>0){
      this.ta=ev.scrollTop/2;
    }else {
      this.ta = 0;
    }
    this.re.setElementStyle(this.header,'webkitTransform','translate3d(0,'+ this.ta +'px,0) scale(1,1)')
  }
}
