<?php
namespace Barryvdh\Debugbar\DataCollector;

use Barryvdh\Debugbar\DataCollector\Util\ValueExporter;
use DebugBar\DataCollector\TimeDataCollector;
use Illuminate\Events\Dispatcher;

class EventCollector extends TimeDataCollector
{
    protected $events = null;
    protected $exporter;

    public function __construct($requestStartTime = null){
        parent::__construct($requestStartTime);
        $this->exporter = new ValueExporter();
    }

    public function onWildcardEvent()
    {
        $args = func_get_args();
        $name = $this->getCurrentEvent($args);
        $time = microtime(true);
        $this->addMeasure($name, $time, $time, $this->prepareParams($args) );
    }

    protected function getCurrentEvent($args)
    {
        if(method_exists($this->events, 'firing')){
            $event = $this->events->firing();
        }else{
            $event = end($args);
        }
        return $event;
    }

    protected function prepareParams($params)
    {
        $data = array();
        foreach ($params as $key => $value) {
	        $data[$key] = $this->exporter->exportValue($value);
        }
        return $data;
    }

	public function subscribe(Dispatcher $events)
	{
		$this->events = $events;
		$events->listen('*', array(
			$this,
			'onWildcardEvent'
		));
    }

    public function collect()
    {
        $data = parent::collect();
        $data['nb_measures'] = count($data['measures']);
        return $data;
    }

    public function getName()
    {
        return 'event';
    }

    public function getWidgets()
    {
        return array(
            "events" => array(
                "icon" => "tasks",
                "widget" => "PhpDebugBar.Widgets.TimelineWidget",
                "map" => "event",
                "default" => "{}"
            ),
            'events:badge' => array(
                'map' => 'event.nb_measures',
                'default' => 0
            )
        );
    }
}
