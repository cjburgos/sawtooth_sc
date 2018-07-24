
    <script> 

    // POST if everything is OK
    Submit('', function(payload)
    {
        // Prevent form submission
        payload.preventDefault();
        // Get the form instance
        var $form = $(payload.target);
        // Use Ajax to submit form data
        $.post($form.attr('display'), $form.serialize(), function(result)
        {
            console.log(result);
        }, 'json');
  });

  </script>